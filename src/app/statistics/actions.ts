// src/app/statistics/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { AccidentRecord, Prisma } from '@prisma/client';

// Type for creation data (omitting 'id')
export type AccidentCreateInput = Omit<Prisma.AccidentRecordCreateInput, 'employee'> & { employeeId: string };
// Type for update data (making fields optional, requiring 'id')
export type AccidentUpdateInput = Partial<Omit<Prisma.AccidentRecordUpdateInput, 'employee'>> & { employeeId?: string };


// Get all accidents
export async function getAccidents(): Promise<AccidentRecord[]> {
  try {
    const accidents = await prisma.accidentRecord.findMany({
      orderBy: { date: 'desc' }, // Order by date descending
      // Include employee details if needed, requires relation setup
      // include: { employee: true }
    });
    // Manually add employeeName if not directly included (adjust based on your final model)
    // This part might be removed if your actual fetch includes the name or if you handle it client-side
     const mockEmployees = [
         { id: 'emp1', name: 'João Silva' },
         { id: 'emp2', name: 'Maria Oliveira' },
         { id: 'emp3', name: 'Carlos Pereira' },
         { id: 'emp4', name: 'Ana Costa' },
         { id: 'emp5', name: 'Pedro Santos' },
     ];
     return accidents.map(acc => ({
         ...acc,
         employeeName: mockEmployees.find(emp => emp.id === acc.employeeId)?.name ?? 'Desconhecido' // Add employee name based on ID
     })) as AccidentRecord[]; // Cast to ensure type compatibility


  } catch (error) {
    console.error("Error fetching accidents:", error);
    throw new Error("Failed to fetch accidents.");
  }
}

// Create a new accident record
export async function createAccident(data: AccidentCreateInput): Promise<AccidentRecord> {
  try {
    const { employeeId, ...restData } = data; // Separate employeeId
    const newAccident = await prisma.accidentRecord.create({
      data: {
        ...restData,
        employee: { // Connect to existing employee using employeeId
            connect: { id: employeeId }
        }
      }
    });

     // Fetch the created record with the name for return consistency (or handle client-side)
     const mockEmployees = [
         { id: 'emp1', name: 'João Silva' },
         { id: 'emp2', name: 'Maria Oliveira' },
         { id: 'emp3', name: 'Carlos Pereira' },
         { id: 'emp4', name: 'Ana Costa' },
         { id: 'emp5', name: 'Pedro Santos' },
     ];
     return {
         ...newAccident,
         employeeName: mockEmployees.find(emp => emp.id === newAccident.employeeId)?.name ?? 'Desconhecido'
     } as AccidentRecord;


  } catch (error) {
    console.error("Error creating accident:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors (e.g., unique constraint violation)
        console.error("Prisma Error Code:", error.code);
     }
    throw new Error("Failed to create accident record.");
  }
}

// Update an existing accident record
export async function updateAccident(id: string, data: AccidentUpdateInput): Promise<AccidentRecord> {
  try {
     const { employeeId, ...restData } = data;
     const updateData: Prisma.AccidentRecordUpdateInput = { ...restData };

     // If employeeId is provided, update the relation
     if (employeeId) {
         updateData.employee = { connect: { id: employeeId } };
     }


    const updatedAccident = await prisma.accidentRecord.update({
      where: { id },
      data: updateData,
    });

     // Fetch the updated record with the name for return consistency
     const mockEmployees = [
         { id: 'emp1', name: 'João Silva' },
         { id: 'emp2', name: 'Maria Oliveira' },
         { id: 'emp3', name: 'Carlos Pereira' },
         { id: 'emp4', name: 'Ana Costa' },
         { id: 'emp5', name: 'Pedro Santos' },
     ];
      return {
          ...updatedAccident,
          employeeName: mockEmployees.find(emp => emp.id === updatedAccident.employeeId)?.name ?? 'Desconhecido'
      } as AccidentRecord;


  } catch (error) {
    console.error(`Error updating accident ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error(`Accident record with ID ${id} not found.`);
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
      throw new Error(`Accident record with ID ${id} not found.`);
    }
    throw new Error("Failed to delete accident record.");
  }
}
