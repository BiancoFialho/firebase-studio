// src/app/cadastros/colaboradores/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { Prisma, Employee as PrismaEmployee } from '@prisma/client';

// Type for Employee
export type Employee = PrismaEmployee;
export type EmployeeCreateInput = Prisma.EmployeeCreateInput;
export type EmployeeUpdateInput = Prisma.EmployeeUpdateInput;

// --- Employee Actions ---

export async function getEmployees(): Promise<Employee[]> {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees.");
  }
}

export async function createEmployee(data: EmployeeCreateInput): Promise<Employee> {
  try {
    const newEmployee = await prisma.employee.create({
      data: data,
    });
    return newEmployee;
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
         throw new Error("Failed to create employee: An employee with this identifier might already exist.");
     }
    throw new Error("Failed to create employee.");
  }
}

export async function updateEmployee(id: string, data: EmployeeUpdateInput): Promise<Employee> {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: data,
    });
    return updatedEmployee;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
               throw new Error("Failed to update employee: An employee with this identifier might already exist.");
           }
          if (error.code === 'P2025') {
             throw new Error(`Employee with ID ${id} not found.`);
          }
     }
    throw new Error("Failed to update employee.");
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
      // Optional: Add checks here to see if the employee is linked to other records (trainings, accidents etc.)
      // before allowing deletion, or handle cascading deletes in the schema carefully.
      // Example check (adjust based on your needs):
      const relatedTrainings = await prisma.trainingRecord.count({ where: { employeeId: id } });
      if (relatedTrainings > 0) {
          throw new Error(`Cannot delete employee: ${relatedTrainings} training records are associated.`);
      }
      // Add similar checks for other relations (PpeRecord, AsoRecord, AccidentRecord, etc.)

    await prisma.employee.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error(`Error deleting employee ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`Employee with ID ${id} not found.`);
     }
    // Rethrow custom error or original error
    throw new Error(error.message || "Failed to delete employee.");
  }
}
