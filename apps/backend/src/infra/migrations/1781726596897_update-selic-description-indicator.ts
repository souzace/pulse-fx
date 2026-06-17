import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    UPDATE indicators 
    SET description = 'Taxa de juros Selic Efetiva' 
    WHERE code = 'SELIC';
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    UPDATE indicators 
    SET description = 'Taxa de juros Selic' 
    WHERE code = 'SELIC';
  `);
}
