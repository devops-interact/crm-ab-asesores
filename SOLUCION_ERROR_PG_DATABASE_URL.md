# 🔧 Solución: Error "Invalid URL" en PostgreSQL

## 🐛 Problema Identificado

El error muestra:
```
TypeError: Invalid URL
input: 'postgres://postgres:postgres@:/default'
```

Esto significa que la aplicación está intentando construir `PG_DATABASE_URL` a partir de `PG_DATABASE_HOST` y `PG_DATABASE_PORT`, pero estas variables están **vacías o no configuradas**.

---

## ✅ SOLUCIÓN: Configurar PG_DATABASE_URL Directamente

### Paso 1: Verificar Variables en Railway

Ve a tu servicio **Server** → **Variables** y verifica:

#### ❌ NO debes tener estas variables (o deben estar vacías):
- `PG_DATABASE_HOST` (puede estar vacía o mal configurada)
- `PG_DATABASE_PORT` (puede estar vacía o mal configurada)

#### ✅ DEBES tener esta variable con la URL COMPLETA:
- `PG_DATABASE_URL` = `postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway`

---

## 🔧 Pasos para Corregir

### 1. En el Servicio SERVER

1. Ve a **Server** → **Variables**
2. Busca `PG_DATABASE_URL`
3. **Edita** y asegúrate de que tenga este valor EXACTO:

```
postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
```

4. Si NO existe `PG_DATABASE_URL`, haz clic en **"+ New Variable"** y créala con ese valor

5. **IMPORTANTE**: Si ves `PG_DATABASE_HOST` o `PG_DATABASE_PORT`, puedes:
   - **Opción A**: Eliminarlas (si Railway te permite)
   - **Opción B**: Dejarlas pero asegúrate de que `PG_DATABASE_URL` esté configurada correctamente

6. **Guarda** los cambios

### 2. En el Servicio WORKER

1. Ve a **Worker** → **Variables**
2. Busca `PG_DATABASE_URL`
3. **Edita** y asegúrate de que tenga este valor EXACTO:

```
postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
```

4. Si NO existe `PG_DATABASE_URL`, haz clic en **"+ New Variable"** y créala con ese valor

5. **Guarda** los cambios

---

## ✅ Verificación Final

Después de configurar `PG_DATABASE_URL`, verifica que:

### En SERVER:
- ✅ `PG_DATABASE_URL` está configurada con la URL completa
- ✅ `SERVER_URL` está configurada
- ✅ `REDIS_URL` está configurada
- ✅ `APP_SECRET` está configurada
- ✅ `NODE_ENV=production`
- ✅ `NODE_PORT=3000`

### En WORKER:
- ✅ `PG_DATABASE_URL` está configurada con la URL completa (misma que Server)
- ✅ `SERVER_URL` está configurada (misma que Server)
- ✅ `REDIS_URL` está configurada (misma que Server)
- ✅ `APP_SECRET` está configurada (misma que Server)
- ✅ `DISABLE_DB_MIGRATIONS=true`
- ✅ `NODE_ENV=production`
- ✅ Comando: `yarn worker:prod` configurado en Settings

---

## 🔍 Cómo Verificar que Funcionó

1. **Guarda** todos los cambios en Railway
2. Railway redesplegará automáticamente
3. Espera 2-5 minutos
4. Ve a **Server** → **Deployments** → **Logs**
5. Busca mensajes como:
   - ✅ `[TypeOrmModule] Connection established successfully`
   - ✅ `[NestApplication] Nest application successfully started`
   - ❌ NO debe aparecer `TypeError: Invalid URL`

---

## ⚠️ Notas Importantes

1. **PG_DATABASE_URL debe ser la URL COMPLETA** - no uses variables separadas
2. **El formato correcto es**: `postgresql://usuario:password@host:puerto/database`
3. **Railway usa** `postgres.railway.internal` para conexiones internas entre servicios
4. **Asegúrate** de que no haya espacios al inicio o final del valor
5. **La URL debe incluir** el protocolo (`postgresql://` o `postgres://`)

---

## 🐛 Si el Error Persiste

Si después de configurar `PG_DATABASE_URL` correctamente el error persiste:

1. **Verifica** que el valor no tenga espacios al inicio/final
2. **Verifica** que la URL esté completa (incluye usuario, password, host, puerto, database)
3. **Revisa** si Railway está ejecutando algún script que sobrescriba `PG_DATABASE_URL`
4. **Verifica** en los logs si hay algún mensaje adicional de error
5. **Asegúrate** de que el servicio PostgreSQL esté corriendo en Railway

---

## 📝 Resumen de la URL Correcta

```
postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
```

**Desglose:**
- Protocolo: `postgresql://`
- Usuario: `postgres`
- Password: `gLBHARJhPtfkldkEWnGREJNMiQueSQWK`
- Host: `postgres.railway.internal` (Railway usa este dominio interno)
- Puerto: `5432`
- Database: `railway`







