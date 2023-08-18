import { ClassConstructor, plainToClass } from 'class-transformer';

// export const mapPlainToEntity = (Entity: any, object) => {
//   return plainToClass(Entity, object, {
//     excludeExtraneousValues: true,
//     exposeUnsetFields: false,
//   });
// };

export const mapPlainToEntity = <T>(
  Entity: ClassConstructor<T>,
  object: any,
): T => {
  return plainToClass(Entity, object, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
};
