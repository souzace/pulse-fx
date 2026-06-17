import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('indicators', {
    last_value: { type: 'numeric', notNull: false },
    reference_date: { type: 'date', notNull: false }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('indicators', 'last_value');
  pgm.dropColumn('indicators', 'reference_date');
}
