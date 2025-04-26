// src/app/statistics/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { Prisma, AccidentRecord as PrismaAccidentRecord } from '@prisma/client';

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
      employeeName: acc.employee.name // Get the name from the included relation
    }));

  } catch (error) {
    console.error("Error fetching accidents:", error);
    throw new Error("Failed to fetch accidents.");
  }
}

// Create a new accident record
export async function createAccident(data: Omit<AccidentCreateInput, 'employee'> & { employeeId: string }): Promise<AccidentRecordWithEmployee> {
  try {
    const { employeeId, ...restData } = data; // Separate employeeId

    if (!employeeId) {
        throw new Error("Employee ID is required to create an accident record.");
    }

    const newAccident = await prisma.accidentRecord.create({
      data: {
        ...restData,
        employee: { // Connect to existing employee using employeeId
            connect: { id: employeeId }
        }
      },
      include: { // Include employee name in the returned record
        employee: { select: { name: true } }
      }
    });

     return {
       ...newAccident,
       employeeName: newAccident.employee.name
     };

  } catch (error) {
    console.error("Error creating accident:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors (e.g., unique constraint violation, foreign key constraint)
        if (error.code === 'P2002') {
            throw new Error("Failed to create accident: Record already exists or violates unique constraint.");
        }
         if (error.code === 'P2025') {
             throw new Error(`Failed to create accident: Employee with ID ${data.employeeId} not found.`);
         }
        console.error("Prisma Error Code:", error.code);
     }
    throw new Error("Failed to create accident record.");
  }
}

// Update an existing accident record
export async function updateAccident(id: string, data: Omit<AccidentUpdateInput, 'employee'> & { employeeId?: string }): Promise<AccidentRecordWithEmployee> {
  try {
     const { employeeId, ...restData } = data;
     const updateData: Prisma.AccidentRecordUpdateArgs['data'] = { ...restData }; // Ensure correct type

     // If employeeId is provided, update the relation
     if (employeeId) {
         updateData.employee = { connect: { id: employeeId } };
     }

    const updatedAccident = await prisma.accidentRecord.update({
      where: { id },
      data: updateData,
      include: { // Include employee name in the returned record
        employee: { select: { name: true } }
      }
    });

      return {
        ...updatedAccident,
        employeeName: updatedAccident.employee.name
      };

  } catch (error) {
    console.error(`Error updating accident ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // This error means the record to update or the related employee was not found
      throw new Error(`Failed to update accident: Record or related employee not found.`);
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

// Get all employees for dropdowns
export async function getEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            select: { id: true, name: true, department: true },
            orderBy: { name: 'asc' }
        });
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees.");
    }
}

// Add other CRUD actions for Employees if needed (createEmployee, updateEmployee, deleteEmployee)

// Example: Create Employee (if you add an employee management section)
export async function createEmployee(data: Prisma.EmployeeCreateInput) {
    try {
        const newEmployee = await prisma.employee.create({ data });
        return newEmployee;
    } catch (error) {
        console.error("Error creating employee:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             throw new Error("Failed to create employee: Employee with this identifier might already exist.");
        }
        throw new Error("Failed to create employee.");
    }
}

    