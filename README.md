# DCG: Data's Colombia Government 🇨🇴

DCG es una plataforma de análisis de datos orientada a evaluar la gestión de los últimos gobiernos de Colombia (1990 - Actualidad). El objetivo es transformar datos macroeconómicos complejos en información visual y comprensible para cualquier ciudadano.

## 🏛️ Los 4 Pilares de Análisis
Nuestro modelo de evaluación se basa en cuatro ejes fundamentales:

1.  **Economía:** Crecimiento del PIB, Inflación e Inversión Extranjera.
2.  **Social & Empleo:** Tasa de Desempleo y Poder Adquisitivo (Salario Mínimo).
3.  **Seguridad & Conflicto:** Impacto del conflicto armado (Bajas en combate).
4.  **Inversión Pública:** Gasto eficiente en Educación y Defensa.

## 🛠️ Tecnologías Utilizadas
- **Backend:** FastAPI (Python) para alojar la base de datos maestra.
- **Data Engine:** Pandas & Requests para el proceso ETL de fuentes oficiales.
- **Dashboard V1:** Streamlit (Python) para visualización interactiva.
- **AI:** Análisis dinámico de resultados mediante LLMs.

---
*Proyecto desarrollado por Degnis Dev - [degnisdev.com](https://degnisdev.com/)*


REQUERIMIENTOS FUNCIONALES

El Dashboard debe permitir:

* Filtrar por año - presidente - pilar (Economia, Social, Seguridad, Inersion) - item (Inflacion, Desempleo...)
* Contar con visualizaciones dinamicas y adecuadas segun el tipo de dato, casi como un POWER BI.
* Si no se hacen filtros mostrara todo el universo de datos, es decir y por ejemplo un grafico de barras con la inflacion en los ultimos 35 años y donde para cada presidente se pinde de un color.
* Comparaciones entre presidentes, años, periodos, todo lo que sea posible.

Basicamente todo lo que pueda hacer y ofrecer un Dashboard de alto rendimiento y estetica, por lo cual la eleccion de tecnologias a utilizar es crucial. 


REQUERIMIENTOS NO FUNCIONALES

* La API debe ser publica, open source, para que cualquiera la pueda consumir.
* El dashboard tambien, debe poderse manipular desde cualquier IP y dispositivo.
* No qqueremos invertir nada, ya que es un proyecto universitario, usaremos mi hosting para alojarla, aunque el mio no resiste PYTHON como backend


***WORK METHOD***

1 No vas a ejecutar nunguna linea de codigo, ni en la terminal.
2 Seras el Director del proyecto y yo el programador.
3 Me daras instrucciones claras paso a paso que yo debo cumplir.
4 Las instrucciones seran tipo: "Ejecuta este comando el cuel nos ayuda con...", "Escribe este codigo en el ficchero x en la linea #, esto es para...".
5 -  Revisaras lo que yo realice y me diras si quedo bien y/o retroalimentacion y cambios.
6 -  Siguiente instruccion.

NOTA: Este es un ejercicio academico y con proposito de aprender a dominar python para el analisis de datos, subir este proyecto a miportafolio. Por ende lo mas importante aqui no es el proyecto en si, sino aprender.

