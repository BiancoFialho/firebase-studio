// src/app/statistics/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { Prisma, AccidentRecord as PrismaAccidentRecord, Employee as PrismaEmployee } from '@prisma/client';

// Type for the full record including employee name
export type AccidentRecordWithEmployee = PrismaAccidentRecord & {
    employeeName?: string | null;
};

// Type for creation data (using Prisma types)
export type AccidentCreateInput = Prisma.AccidentRecordCreateInput;
// Type for update data (using Prisma types)
export type AccidentUpdateInput = Prisma.AccidentRecordUpdateInput;


// Get all accidents including employee name
export async function getAccidents(): Promise<AccidentRecordWithEmployee[]> {
  try {
    const accidents = await prisma.accidentRecord.findMany({
      orderBy: { date: 'desc' },
      include: {
        employee: { // Include the related employee
          select: { name: true } // Select only the name
        }
      }
    });

    // Map to the desired structure including employeeName
    return accidents.map(acc => ({
      ...acc,
      employeeName: acc.employee?.name // Use optional chaining as employee might be null if relation fails
    }));

  } catch (error) {
    console.error("Error fetching accidents:", error);
    throw new Error("Failed to fetch accidents.");
  }
}

// Create a new accident record
// Use Unchecked type to allow passing employeeId directly
export async function createAccident(data: Omit<Prisma.AccidentRecordUncheckedCreateInput, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccidentRecordWithEmployee> {
  try {
    if (!data.employeeId) {
        throw new Error("Employee ID is required to create an accident record.");
    }

    const newAccident = await prisma.accidentRecord.create({
      data: data, // Pass data directly, Prisma handles relation via employeeId
      include: { // Include employee name in the returned record
        employee: { select: { name: true } }
      }
    });

     return {
       ...newAccident,
       employeeName: newAccident.employee?.name // Use optional chaining
     };

  } catch (error) {
    console.error("Error creating accident:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors (e.g., unique constraint violation, foreign key constraint)
        if (error.code === 'P2002') {
            throw new Error("Failed to create accident: Record already exists or violates unique constraint.");
        }
         if (error.code === 'P2003') { // Foreign key constraint failed
             throw new Error(`Failed to create accident: Employee with ID ${data.employeeId} not found or invalid.`);
         }
         if (error.code === 'P2025') {
             throw new Error(`Failed to create accident: Required related record (Employee) not found.`);
         }
        console.error("Prisma Error Code:", error.code);
     }
    throw new Error("Failed to create accident record.");
  }
}

// Update an existing accident record
// Use Unchecked type to allow passing employeeId directly
export async function updateAccident(id: string, data: Omit<Prisma.AccidentRecordUncheckedUpdateInput, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccidentRecordWithEmployee> {
  try {
    const updatedAccident = await prisma.accidentRecord.update({
      where: { id },
      data: data, // Pass data directly, Prisma handles relation update via employeeId if present
      include: { // Include employee name in the returned record
        employee: { select: { name: true } }
      }
    });

      return {
        ...updatedAccident,
        employeeName: updatedAccident.employee?.name // Use optional chaining
      };

  } catch (error) {
    console.error(`Error updating accident ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // This error means the record to update or the related employee was not found
      throw new Error(`Failed to update accident: Record or related employee not found.`);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003' && data.employeeId) {
        throw new Error(`Failed to update accident: Employee with ID ${data.employeeId} not found or invalid.`);
    }
    throw new Error("Failed to update accident record.");
  }
}

// Delete an accident record
export async function deleteAccident(id: string): Promise<void> {
  try {
    await prisma.accidentRecord.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting accident ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // This error means the record to delete was not found
      throw new Error(`Accident record with ID ${id} not found.`);
    }
    throw new Error("Failed to delete accident record.");
  }
}

// --- Add Employee Actions ---
// Get all employees for dropdowns and Colaboradores page
export async function getEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            // Select all fields needed for the Colaboradores page display and editing
            select: {
                id: true,
                name: true,
                department: true,
                position: true,
                hireDate: true,
                createdAt: true,
                updatedAt: true
             },
            orderBy: { name: 'asc' }
        });
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees.");
    }
}

// Add other CRUD actions for Employees if needed (createEmployee, updateEmployee, deleteEmployee are in collaborators/actions.ts)
