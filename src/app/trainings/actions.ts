// src/app/trainings/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { Prisma, TrainingRecord as PrismaTrainingRecord, TrainingType as PrismaTrainingType, Employee as PrismaEmployee } from '@prisma/client';

// Type for the full TrainingRecord including related data
export type TrainingRecordWithDetails = PrismaTrainingRecord & {
    employeeName?: string | null;
    trainingTypeName?: string | null;
};

// Type for creation data - Use Prisma's generated type
export type TrainingRecordCreateInput = Prisma.TrainingRecordCreateInput;
// Type for update data - Use Prisma's generated type
export type TrainingRecordUpdateInput = Prisma.TrainingRecordUpdateInput;


// Type for TrainingType
export type TrainingType = PrismaTrainingType;
export type TrainingTypeCreateInput = Prisma.TrainingTypeCreateInput;
export type TrainingTypeUpdateInput = Prisma.TrainingTypeUpdateInput;

// --- Employee Actions (Moved here for simplicity, or keep separate) ---
export type Employee = PrismaEmployee;

export async function getEmployees(): Promise<Employee[]> {
    try {
        const employees = await prisma.employee.findMany({
            select: { id: true, name: true, department: true, position: true, hireDate: true, createdAt: true, updatedAt: true }, // Select specific fields if needed
            orderBy: { name: 'asc' }
        });
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees.");
    }
}

// --- Training Record Actions ---

export async function getTrainingRecords(): Promise<TrainingRecordWithDetails[]> {
  try {
    const records = await prisma.trainingRecord.findMany({
      orderBy: { trainingDate: 'desc' },
      include: {
        employee: { select: { name: true } },
        trainingType: { select: { name: true } } // Include training type name
      }
    });

    return records.map(rec => ({
      ...rec,
      employeeName: rec.employee?.name, // Handle potentially null employee if relation optional/error
      trainingTypeName: rec.trainingType.name // Get type name
    }));

  } catch (error) {
    console.error("Error fetching training records:", error);
    throw new Error("Failed to fetch training records.");
  }
}

// Simplified create input type for the function argument
type CreateRecordData = Omit<Prisma.TrainingRecordUncheckedCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export async function createTrainingRecord(data: CreateRecordData): Promise<TrainingRecordWithDetails> {
  try {
    const newRecord = await prisma.trainingRecord.create({
      data: {
          ...data,
          status: 'Valido', // Set initial status - can be recalculated on fetch
          // Ensure employeeId and trainingTypeId are provided in `data`
      },
      include: {
        employee: { select: { name: true } },
        trainingType: { select: { name: true } }
      }
    });
     return {
       ...newRecord,
       employeeName: newRecord.employee?.name,
       trainingTypeName: newRecord.trainingType.name
     };
  } catch (error) {
    console.error("Error creating training record:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            throw new Error("Failed to create training: Record already exists or violates unique constraint.");
        }
         if (error.code === 'P2003') { // Foreign key constraint failed
             throw new Error(`Failed to create training: Invalid Employee ID or Training Type ID provided.`);
         }
         if (error.code === 'P2025') { // Record not found (can happen in relations)
             throw new Error(`Failed to create training: Related Employee or Training Type not found.`);
         }
    }
    throw new Error("Failed to create training record.");
  }
}

// Simplified update input type for the function argument
type UpdateRecordData = Omit<Prisma.TrainingRecordUncheckedUpdateInput, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'employeeId' | 'trainingTypeId'> & {
    employeeId?: string; // Make relational IDs optional in the update payload if needed
    trainingTypeId?: string;
};


export async function updateTrainingRecord(id: string, data: UpdateRecordData): Promise<TrainingRecordWithDetails> {
    const { employeeId, trainingTypeId, ...restData } = data;

    const updatePayload: Prisma.TrainingRecordUpdateInput = { ...restData };

    // Only include relations if they are provided
    if (employeeId) {
        updatePayload.employee = { connect: { id: employeeId } };
    }
    if (trainingTypeId) {
        updatePayload.trainingType = { connect: { id: trainingTypeId } };
    }


  try {
    const updatedRecord = await prisma.trainingRecord.update({
      where: { id },
      data: updatePayload,
      include: {
        employee: { select: { name: true } },
        trainingType: { select: { name: true } }
      }
    });
     return {
       ...updatedRecord,
       employeeName: updatedRecord.employee?.name,
       trainingTypeName: updatedRecord.trainingType.name
     };
  } catch (error) {
    console.error(`Error updating training record ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error(`Failed to update training: Record, Employee or Training Type not found.`);
    }
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') { // Foreign key constraint failed
         throw new Error(`Failed to update training: Invalid Employee ID or Training Type ID provided.`);
     }
    throw new Error("Failed to update training record.");
  }
}

export async function deleteTrainingRecord(id: string): Promise<void> {
  try {
    await prisma.trainingRecord.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting training record ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Training record with ID ${id} not found.`);
     }
    throw new Error("Failed to delete training record.");
  }
}

// --- Training Type Actions ---

export async function getTrainingTypes(): Promise<TrainingType[]> {
  try {
    const types = await prisma.trainingType.findMany({
      orderBy: { name: 'asc' },
    });
    return types;
  } catch (error) {
    console.error("Error fetching training types:", error);
    throw new Error("Failed to fetch training types.");
  }
}

export async function createTrainingType(data: TrainingTypeCreateInput): Promise<TrainingType> {
    // Basic validation for JSON strings (can be enhanced)
    if (data.instructorsJson && !isValidJsonString(data.instructorsJson)) {
        throw new Error("Invalid format for Instructors JSON.");
    }
    if (data.requiredNrsJson && !isValidJsonString(data.requiredNrsJson)) {
         throw new Error("Invalid format for Required NRs JSON.");
     }

  try {
    const newType = await prisma.trainingType.create({
      data: data,
    });
    return newType;
  } catch (error) {
    console.error("Error creating training type:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
         throw new Error(`Failed to create training type: Name "${data.name}" already exists.`);
     }
    throw new Error("Failed to create training type.");
  }
}

export async function updateTrainingType(id: string, data: TrainingTypeUpdateInput): Promise<TrainingType> {
     // Basic validation for JSON strings (can be enhanced)
     if (data.instructorsJson && typeof data.instructorsJson === 'string' && !isValidJsonString(data.instructorsJson)) {
         throw new Error("Invalid format for Instructors JSON.");
     }
    if (data.requiredNrsJson && typeof data.requiredNrsJson === 'string' && !isValidJsonString(data.requiredNrsJson)) {
         throw new Error("Invalid format for Required NRs JSON.");
     }

  try {
    const updatedType = await prisma.trainingType.update({
      where: { id },
      data: data,
    });
    return updatedType;
  } catch (error) {
    console.error(`Error updating training type ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
               throw new Error(`Failed to update training type: Name "${data.name}" already exists.`);
           }
          if (error.code === 'P2025') {
             throw new Error(`Training type with ID ${id} not found.`);
          }
     }
    throw new Error("Failed to update training type.");
  }
}

export async function deleteTrainingType(id: string): Promise<void> {
  try {
     // Check if any TrainingRecords use this type before deleting
     const relatedRecords = await prisma.trainingRecord.count({ where: { trainingTypeId: id } });
     if (relatedRecords > 0) {
         throw new Error(`Cannot delete training type: ${relatedRecords} training records are associated with it.`);
     }

    await prisma.trainingType.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error(`Error deleting training type ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Training type with ID ${id} not found.`);
     }
    // Rethrow custom error or original error
    throw new Error(error.message || "Failed to delete training type.");
  }
}

// Helper function to validate JSON string (basic check)
function isValidJsonString(str: string | null | undefined): boolean {
    if (!str) return true; // Allow null/undefined
    try {
        const parsed = JSON.parse(str);
        // Optionally add more checks, e.g., ensure it's an array of strings
        return Array.isArray(parsed);
    } catch (e) {
        return false;
    }
}
