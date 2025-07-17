import Product from '../src/product/product.model.js';

export const createDefaultProducts = async () => {
    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log("Default products already exist.");
            return;
        }

        const products = [
            {
                name: "Seguro de Vida Básico",
                descripcion: "Cobertura de seguro de vida con un beneficio de Q50,000 para proteger a tu familia.",
                price: 150,
                stock: 100
            },
            {
                name: "Asesoría Financiera Personal",
                descripcion: "Una hora de consultoría con un experto financiero para planificar tu futuro y optimizar tus inversiones.",
                price: 500,
                stock: 50
            },
            {
                name: "Tarjeta de Crédito Oro",
                descripcion: "Acceso a la tarjeta de crédito Oro con beneficios exclusivos, acumulación de puntos y sin membresía el primer año.",
                price: 0,
                stock: 200
            },
            {
                name: "Préstamo Personal Rápido",
                descripcion: "Obtén un préstamo personal de hasta Q25,000 con aprobación en menos de 24 horas.",
                price: 100, // Costo administrativo
                stock: 100
            },
            {
                name: "Caja de Seguridad Pequeña",
                descripcion: "Alquiler anual de una caja de seguridad para resguardar tus documentos y objetos de valor.",
                price: 800,
                stock: 30
            },
            {
                name: "Taller de Educación Financiera",
                descripcion: "Acceso a un taller online de 4 horas sobre cómo manejar tu dinero, ahorrar e invertir inteligentemente.",
                price: 250,
                stock: 500
            },
            {
                name: "Seguro contra Robo para Hogar",
                descripcion: "Protege tu hogar y tus pertenencias con nuestra póliza de seguro contra robos y daños.",
                price: 450,
                stock: 150
            },
            {
                name: "Cuenta de Ahorro para Niños",
                descripcion: "Abre una cuenta de ahorro para tus hijos con una tasa de interés preferencial para fomentar el hábito del ahorro.",
                price: 0,
                stock: 1000
            },
            {
                name: "Chequera Ejecutiva",
                descripcion: "Solicita una chequera de 50 cheques para tu cuenta monetaria con diseño ejecutivo.",
                price: 125,
                stock: 300
            },
            {
                name: "Análisis de Inversión de Cartera",
                descripcion: "Un analista revisará tu portafolio de inversiones actual y te dará recomendaciones personalizadas.",
                price: 1200,
                stock: 20
            }
        ];

        await Product.insertMany(products);
        console.log("10 default products created successfully.");

    } catch (err) {
        console.error("Error creating default products:", err);
    }
};