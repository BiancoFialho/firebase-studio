// src/app/trainings/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { Prisma, TrainingRecord as PrismaTrainingRecord, TrainingType as PrismaTrainingType } from '@prisma/client';

// Type for the full TrainingRecord including related data
export type TrainingRecordWithDetails = PrismaTrainingRecord & {
    employeeName?: string | null;
    trainingTypeName?: string | null;
};

// Type for creation data
export type TrainingRecordCreateInput = Prisma.TrainingRecordUncheckedCreateInput;
// Type for update data
export type TrainingRecordUpdateInput = Prisma.TrainingRecordUncheckedUpdateInput;

// Type for TrainingType
export type TrainingType = PrismaTrainingType;
export type TrainingTypeCreateInput = Prisma.TrainingTypeCreateInput;
export type TrainingTypeUpdateInput = Prisma.TrainingTypeUpdateInput;


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

export async function createTrainingRecord(data: Omit<TrainingRecordCreateInput, 'status' | 'employee' | 'trainingType'>): Promise<TrainingRecordWithDetails> {
  try {
    const newRecord = await prisma.trainingRecord.create({
      data: {
          ...data,
          status: 'Valido', // Set initial status - can be recalculated on fetch
          // Relations are handled by Prisma using IDs (employeeId, trainingTypeId)
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
         if (error.code === 'P2025') {
             throw new Error(`Failed to create training: Employee or Training Type not found.`);
         }
    }
    throw new Error("Failed to create training record.");
  }
}

export async function updateTrainingRecord(id: string, data: Omit<TrainingRecordUpdateInput, 'status' | 'employee' | 'trainingType'>): Promise<TrainingRecordWithDetails> {
  try {
    const updatedRecord = await prisma.trainingRecord.update({
      where: { id },
      data: data,
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
    // Validate instructorsJson if provided
    if (data.instructorsJson) {
        try {
            const instructors = JSON.parse(data.instructorsJson);
            if (!Array.isArray(instructors) || !instructors.every(i => typeof i === 'string')) {
                throw new Error("Instructors JSON must be an array of strings.");
            }
        } catch (e) {
            throw new Error("Invalid format for Instructors JSON.");
        }
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
     // Validate instructorsJson if provided and being updated
     if (data.instructorsJson && typeof data.instructorsJson === 'string') {
         try {
             const instructors = JSON.parse(data.instructorsJson);
             if (!Array.isArray(instructors) || !instructors.every(i => typeof i === 'string')) {
                 throw new Error("Instructors JSON must be an array of strings.");
             }
         } catch (e) {
             throw new Error("Invalid format for Instructors JSON.");
         }
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
