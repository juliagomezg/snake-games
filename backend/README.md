# Snake Game Analytics Backend

Este es el backend para el análisis de datos del juego Snake con IA. Procesa los datos de juego, genera insights y proporciona recomendaciones personalizadas.

## Tecnologías utilizadas

- **FastAPI**: Framework web rápido para APIs
- **SQLAlchemy**: ORM para interactuar con la base de datos
- **PostgreSQL**: Base de datos relacional
- **Scikit-learn**: Biblioteca de machine learning
- **Pandas/NumPy**: Procesamiento y análisis de datos
- **SendGrid**: Envío de notificaciones por email

## Requisitos

- Python 3.9+
- PostgreSQL 13+

## Instalación

1. Clonar el repositorio
2. Crear un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```
5. Inicializar la base de datos:
   ```bash
   alembic upgrade head
   ```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`.

## Documentación de la API

Una vez que el servidor esté en ejecución, puedes acceder a la documentación interactiva:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Estructura del proyecto

```
backend/
├── alembic/              # Migraciones de base de datos
├── app/
│   ├── api/              # Endpoints de la API
│   ├── core/             # Configuración central
│   ├── db/               # Configuración de base de datos
│   ├── models/           # Modelos SQLAlchemy
│   ├── schemas/          # Esquemas Pydantic
│   ├── services/         # Lógica de negocio
│   ├── ml/               # Modelos de machine learning
│   │   ├── models/       # Modelos entrenados
│   │   ├── training/     # Scripts de entrenamiento
│   │   └── prediction/   # Scripts de predicción
│   └── utils/            # Utilidades
├── tests/                # Tests
├── .env                  # Variables de entorno (no incluido en git)
├── .env.example          # Ejemplo de variables de entorno
├── requirements.txt      # Dependencias
└── README.md             # Este archivo
```

## Endpoints principales

- `POST /api/game-sessions`: Enviar datos de una partida
- `GET /api/ai-insights/{session_id}`: Obtener insights de IA para una sesión
- `POST /api/stats-analysis`: Enviar estadísticas para análisis
- `GET /api/personalized-recommendations`: Obtener recomendaciones personalizadas

## Modelos de IA implementados

1. **Predicción de comportamiento**: Analiza patrones de movimiento y predice posibles errores.
2. **Segmentación de jugadores**: Clasifica jugadores en categorías como "agresivo", "precavido" o "estratégico".
3. **Análisis de patrones**: Identifica patrones comunes en el estilo de juego.
4. **Recomendaciones personalizadas**: Sugiere mejoras basadas en el análisis del comportamiento.

## Contribución

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request 