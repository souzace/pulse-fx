import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS indicators (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        source VARCHAR(50) NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS indicator_values (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        indicator_id UUID NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
        value NUMERIC(18, 4) NOT NULL,
        reference_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_indicator_reference_date UNIQUE (indicator_id, reference_date)
    );

    CREATE INDEX IF NOT EXISTS idx_indicator_values_lookup 
    ON indicator_values (indicator_id, reference_date DESC);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE IF EXISTS indicator_values;
    DROP TABLE IF EXISTS indicators;
  `);
}
