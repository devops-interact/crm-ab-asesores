# Opciones Disponibles para Resolver Error FullName - Revisión Completa

## 🔍 Estado Actual del Problema

**Síntomas:**
- Los registros se crean (el contador aumenta)
- Pero NO se pueden ver en la lista
- Error GraphQL: `Cannot return null for non-nullable field FullName.firstName/lastName`

**Causa:**
- Base de datos tiene valores `null` en `nameFirstName` y `nameLastName`
- GraphQL schema espera strings no-nullables
- El resolver que implementamos puede no estar funcionando o no se ha deployado

---

## ✅ Lo que YA hemos hecho

### 1. ✅ Resolver GraphQL (Opción 1) - IMPLEMENTADO PERO NO VERIFICADO
**Archivo:** `composite-field-metadata-gql-object-type.generator.ts`
**Estado:** Código agregado, pero puede que:
- No se haya hecho commit/push
- No se haya deployado en Railway
- El resolver no esté interceptando correctamente los valores null

**Ubicación del código:**
```typescript
// Líneas 94-111
if (compositeType.type === FieldMetadataType.FULL_NAME &&
    (property.name === 'firstName' || property.name === 'lastName')) {
  fieldConfig.resolve = (parent: any) => {
    const value = parent?.[property.name];
    return value ?? '';
  };
}
```

---

## 🆕 Opciones NUEVAS que NO hemos usado

### Opción 7: Interceptar en `processCompositeField` ⭐ NUEVA

**Qué hacer:**
- Modificar `processCompositeField` para convertir nulls a strings vacíos ANTES de llegar a GraphQL
- Esto intercepta los datos en un punto más temprano del proceso

**Ventajas:**
- ✅ Intercepta antes de GraphQL
- ✅ Afecta todos los objetos que usan FullName
- ✅ Más temprano en el pipeline = más seguro

**Desventajas:**
- ⚠️ Requiere modificar código del servidor
- ⚠️ Puede ocultar datos corruptos

**Ubicación:**
`packages/twenty-server/src/engine/api/graphql/graphql-query-runner/helpers/object-records-to-graphql-connection.helper.ts`
Línea 323-363 (`processCompositeField`)

**Implementación:**
```typescript
private processCompositeField(...) {
  // ... código existente ...

  return Object.entries(fieldValue).reduce((acc, [subFieldKey, subFieldValue]) => {
    // ... código existente ...

    // NUEVO: Para FullName, convertir nulls a strings vacíos
    if (fieldMetadata.type === FieldMetadataType.FULL_NAME &&
        (subFieldKey === 'firstName' || subFieldKey === 'lastName')) {
      subFieldValue = subFieldValue ?? '';
    }

    acc[subFieldKey] = this.formatFieldValue(subFieldValue, subFieldMetadata.type);
    return acc;
  }, {});
}
```

---

### Opción 8: Interceptar en `formatFieldValue` ⭐ NUEVA

**Qué hacer:**
- Modificar `formatFieldValue` para manejar nulls en campos TEXT cuando vienen de FullName
- Más general, pero menos específico

**Ventajas:**
- ✅ Intercepta en un punto centralizado
- ✅ Afecta todos los campos TEXT que sean null

**Desventajas:**
- ⚠️ Puede afectar otros campos TEXT que deberían ser null
- ⚠️ Menos específico

**Ubicación:**
`packages/twenty-server/src/engine/api/graphql/graphql-query-runner/helpers/object-records-to-graphql-connection.helper.ts`
Línea 366-374 (`formatFieldValue`)

---

### Opción 2: Limpiar Base de Datos con SQL Directo ⭐ NO USADA COMPLETAMENTE

**Qué hacer:**
- Conectarse directamente a PostgreSQL en Railway
- Ejecutar UPDATE para limpiar todos los nulls

**Ventajas:**
- ✅ Resuelve el problema en la raíz
- ✅ No requiere cambios de código
- ✅ Los datos quedan consistentes

**Desventajas:**
- ⚠️ Requiere acceso directo a la base de datos
- ⚠️ Puede afectar muchos registros

**Cómo conectarse a Railway PostgreSQL:**

1. **Obtener credenciales:**
   - En Railway, ve a tu servicio `twenty_postgres`
   - Ve a la pestaña "Variables"
   - Busca `DATABASE_URL` o `POSTGRES_URL`
   - Copia la connection string

2. **Formato de connection string:**
   ```
   postgresql://postgres:PASSWORD@HOST:PORT/railway
   ```

3. **Opciones para conectarse:**

   **Opción A: Railway CLI (más fácil)**
   ```bash
   # Instalar Railway CLI si no lo tienes
   npm i -g @railway/cli

   # Login
   railway login

   # Conectarse a PostgreSQL
   railway connect postgres
   ```

   **Opción B: psql (desde tu PC)**
   ```bash
   # Usar la connection string de Railway
   psql "postgresql://postgres:PASSWORD@HOST:PORT/railway"
   ```

   **Opción C: Herramienta GUI (DBeaver, pgAdmin)**
   - Usar la connection string de Railway
   - Configurar conexión con los datos de la URL

4. **SQL para limpiar datos:**
   ```sql
   -- Verificar cuántos registros tienen nulls
   SELECT
     COUNT(*) as total,
     COUNT(CASE WHEN "nameFirstName" IS NULL OR TRIM("nameFirstName") = '' THEN 1 END) as sin_nombre,
     COUNT(CASE WHEN "nameLastName" IS NULL OR TRIM("nameLastName") = '' THEN 1 END) as sin_apellido
   FROM person;

   -- Backup (opcional pero recomendado)
   CREATE TABLE person_backup_20250102 AS SELECT * FROM person;

   -- Limpiar nulls en nameFirstName
   UPDATE person
   SET "nameFirstName" = COALESCE(NULLIF(TRIM("nameFirstName"), ''), 'Sin nombre')
   WHERE "nameFirstName" IS NULL OR TRIM("nameFirstName") = '';

   -- Limpiar nulls en nameLastName
   UPDATE person
   SET "nameLastName" = COALESCE(NULLIF(TRIM("nameLastName"), ''), 'Sin apellido')
   WHERE "nameLastName" IS NULL OR TRIM("nameLastName") = '';

   -- Verificar que no queden nulls
   SELECT COUNT(*) as registros_con_null
   FROM person
   WHERE "nameFirstName" IS NULL OR "nameLastName" IS NULL;

   -- Ver algunos registros para confirmar
   SELECT id, "nameFirstName", "nameLastName"
   FROM person
   LIMIT 10;
   ```

---

### Opción 3: Hacer Campos Nullable en GraphQL Schema ⭐ NO USADA

**Qué hacer:**
- Modificar el generador para forzar `nullable: true` para campos FullName
- Esto permite que GraphQL acepte nulls

**Ventajas:**
- ✅ Permite que GraphQL acepte nulls
- ✅ No requiere limpiar datos

**Desventajas:**
- ⚠️ El frontend podría necesitar cambios
- ⚠️ Los datos siguen corruptos

**Ubicación:**
`packages/twenty-server/src/engine/api/graphql/workspace-schema-builder/graphql-type-generators/object-types/composite-field-metadata-gql-object-type.generator.ts`
Línea 63-67

**Implementación:**
```typescript
const typeOptions = {
  nullable: !property.isRequired,
  isArray: property.type === FieldMetadataType.MULTI_SELECT || property.isArray,
};

// NUEVO: Forzar nullable para FullName
if (compositeType.type === FieldMetadataType.FULL_NAME &&
    (property.name === 'firstName' || property.name === 'lastName')) {
  typeOptions.nullable = true;
}
```

---

## 📊 Comparación de Opciones Nuevas

| Opción | Complejidad | Riesgo | Efectividad | Tiempo | Estado |
|--------|-------------|--------|-------------|--------|--------|
| 7. processCompositeField | Media | Bajo | Alta | 30 min | ⭐ NUEVA |
| 8. formatFieldValue | Baja | Medio | Media | 15 min | ⭐ NUEVA |
| 2. Limpiar DB (SQL) | Media | Medio | Alta | 30 min | ⚠️ NO USADA |
| 3. Hacer nullable | Baja | Medio | Media | 20 min | ⚠️ NO USADA |

---

## 🎯 Recomendación: Combinación de Opciones

### Fase 1: Verificar Resolver Actual (Opción 1)
1. Verificar que el código del resolver esté en el repositorio
2. Verificar que se haya hecho commit y push
3. Verificar que Railway haya deployado los cambios
4. Si no funciona, pasar a Fase 2

### Fase 2: Agregar Interceptación Temprana (Opción 7)
- Modificar `processCompositeField` para convertir nulls antes de GraphQL
- Esto asegura que los datos siempre lleguen limpios a GraphQL

### Fase 3: Limpiar Base de Datos (Opción 2)
- Conectarse a PostgreSQL en Railway
- Ejecutar SQL para limpiar todos los nulls
- Esto resuelve el problema en la raíz

---

## 🔧 Cómo Limpiar Base de Datos en Railway PostgreSQL

### Método 1: Railway CLI (Recomendado)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Seleccionar tu proyecto
railway link

# 4. Conectarse a PostgreSQL
railway connect postgres

# 5. Una vez conectado, ejecutar SQL:
```

Luego ejecutar los SQLs de limpieza mencionados arriba.

### Método 2: Connection String Directo

1. En Railway, ve a `twenty_postgres` → Variables
2. Copia `DATABASE_URL` o `POSTGRES_URL`
3. Usa psql o herramienta GUI:
   ```bash
   psql "TU_CONNECTION_STRING_AQUI"
   ```
4. Ejecuta los SQLs de limpieza

### Método 3: Railway Web Console (si está disponible)

Algunos servicios de Railway tienen una consola web para ejecutar SQL directamente.

---

## 📝 Plan de Acción Recomendado

### Paso 1: Verificar Resolver Actual
```bash
# Verificar que el código esté commiteado
git log --oneline -5
git show HEAD:packages/twenty-server/src/engine/api/graphql/workspace-schema-builder/graphql-type-generators/object-types/composite-field-metadata-gql-object-type.generator.ts | grep -A 10 "processCompositeField"
```

### Paso 2: Si el resolver no funciona, agregar Opción 7
- Modificar `processCompositeField` para interceptar nulls
- Hacer commit y push
- Deploy en Railway

### Paso 3: Limpiar Base de Datos (Opción 2)
- Conectarse a PostgreSQL
- Ejecutar SQLs de limpieza
- Verificar resultados

### Paso 4: Verificar que funcione
- Probar crear nuevo registro
- Verificar que se muestre en la lista
- Verificar que no haya más errores GraphQL

---

## ⚠️ Opciones NO Recomendadas (ya revisadas)

- ❌ Opción 4: Crear objeto nuevo (demasiado complejo)
- ❌ Opción 5: Modificar FullNameDTO (solo afecta WorkspaceMember)
- ❌ Opción 6: Default values (no resuelve datos existentes)

---

## 🚨 Importante

**NO ejecutar nada todavía.** Primero:
1. Revisar qué opción prefieres
2. Verificar estado actual del código
3. Planificar el approach
4. Luego ejecutar




