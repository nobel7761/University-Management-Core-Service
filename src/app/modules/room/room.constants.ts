export const RoomSearchAbleFields = ['floor', 'roomNumber'];

export const RoomFilterAbleFileds = ['searchTerm', 'id', 'buildingId'];

export const roomRelationalFields: string[] = ['buildingId'];

export const roomRelationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};
