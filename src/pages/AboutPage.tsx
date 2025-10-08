// ruta: frontend/src/pages/AboutPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <Link to="/login" className={styles.backLink}>
        &larr; Regresar a Iniciar Sesión
      </Link>

      <h1 className={styles.mainTitle}>TEDICS</h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.9)', 
        fontSize: '1.4rem', 
        marginBottom: '3rem',
        fontWeight: '300',
        letterSpacing: '1px'
      }}>
        Soluciones Tecnológicas a tu Medida
      </p>

      <div className={styles.contentWrapper}>
        <div className={styles.infoBlock}>
          <h2 className={styles.infoTitle}>Misión</h2>
          <p className={styles.infoText}>
            Ser el proveedor líder de servicios técnicos esenciales (electricidad, mantenimiento y seguridad) en Huehuetenango, Guatemala, garantizando la confiabilidad y la trazabilidad total en cada intervención. Utilizamos nuestra plataforma digital para optimizar la eficiencia, asegurar la calidad y proporcionar a nuestros clientes la tranquilidad de un servicio gestionado con transparencia y rapidez, superando el estándar de la industria.
          </p>
        </div>

        <div className={styles.infoBlock}>
          <h2 className={styles.infoTitle}>Visión</h2>
          <p className={styles.infoText}>
            Transformar el sector de servicios técnicos a través de la innovación digital, siendo reconocidos para el año 2029 como la plataforma de referencia por nuestra excelencia operativa, transparencia total y la experiencia de usuario inigualable que elimina las fricciones de la gestión tradicional, impulsando un crecimiento sostenible y seguro para nuestros clientes y colaboradores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;