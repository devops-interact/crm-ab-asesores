# 📋 Referencia Rápida: Variables de Entorno Railway

## 🔴 Variables OBLIGATORIAS

### Para SERVER y WORKER (ambos necesitan estas):

```bash
# URL pública de tu aplicación (obtener de Railway → Settings → Domains)
SERVER_URL=https://tu-app-production.up.railway.app

# URL de PostgreSQL (obtener de Railway → PostgreSQL → Variables → DATABASE_URL)
PG_DATABASE_URL=postgresql://postgres:password@host:5432/database

# URL de Redis (obtener de Railway → Redis → Variables → REDIS_URL)
REDIS_URL=redis://default:password@host:6379

# Clave secreta generada por ti (mínimo 32 caracteres)
APP_SECRET=tu-clave-secreta-generada-aqui

# Entorno de producción
NODE_ENV=production
```

### Solo para SERVER:

```bash
# Puerto del servidor
NODE_PORT=3000
```

### Solo para WORKER:

```bash
# Deshabilitar migraciones en el worker (las ejecuta el server)
DISABLE_DB_MIGRATIONS=true
```

---

## 🟡 Variables OPCIONALES (pero recomendadas)

```bash
# Nivel de logging
LOG_LEVEL=info

# Tipo de almacenamiento (local por defecto)
STORAGE_TYPE=local
```

---

## 📍 Dónde encontrar cada valor en Railway

| Variable | Dónde encontrarla |
|----------|-------------------|
| `SERVER_URL` | Server → Settings → Domains → URL pública |
| `PG_DATABASE_URL` | PostgreSQL → Variables → `DATABASE_URL` o `POSTGRES_URL` |
| `REDIS_URL` | Redis → Variables → `REDIS_URL` |
| `APP_SECRET` | **Tú la generas** (ver guía principal) |

---

## ⚠️ IMPORTANTE

1. **APP_SECRET**: Debe ser la **misma** en Server y Worker
2. **PG_DATABASE_URL**: Copia el valor **completo** de Railway
3. **SERVER_URL**: Debe incluir `https://` y no terminar con `/`
4. **Worker**: Debe tener `DISABLE_DB_MIGRATIONS=true`

---

## 🔄 Orden de Configuración Recomendado

1. ✅ Agregar PostgreSQL → Copiar `DATABASE_URL`
2. ✅ Agregar Redis → Copiar `REDIS_URL`
3. ✅ Generar `APP_SECRET`
4. ✅ Obtener `SERVER_URL` del dominio de Railway
5. ✅ Configurar variables en Server
6. ✅ Configurar variables en Worker (mismas + `DISABLE_DB_MIGRATIONS=true`)







