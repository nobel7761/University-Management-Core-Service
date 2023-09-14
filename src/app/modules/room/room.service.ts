/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Room } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { RoomSearchAbleFields } from './room.constants';
import { IRoomFilterRequest } from './room.interfaces';

const createRoom = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
  });

  return result;
};

const getAllRoom = async (
  filters: IRoomFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: RoomSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.room.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.room.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room Doesn't Exists");
  }

  return result;
};

const updateSingleRoom = async (
  data: Partial<Room>,
  id: string
): Promise<Room | null> => {
  const isExists = await prisma.room.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room Doesn't Exists");
  }

  const result = await prisma.room.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSingleRoom = async (id: string): Promise<Room> => {
  const result = await prisma.room.delete({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room Doesn't Exists");
  }

  return result;
};

export const RoomService = {
  createRoom,
  getAllRoom,
  getSingleRoom,
  updateSingleRoom,
  deleteSingleRoom,
};
