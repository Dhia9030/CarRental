
import { registerEnumType } from '@nestjs/graphql'

export enum FuelType {
    GASOLINE = 'gasoline',
    DIESEL = 'diesel',
    ELECTRIC = 'electric',
    HYBRID = 'hybrid',
}

registerEnumType(FuelType, {name: 'FuelType'});