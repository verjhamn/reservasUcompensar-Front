export const getReservas = async (fechaSeleccionada) => {
    // Simulación de respuesta del backend
    const mockData = {
      "02/01/2025": [
        {
          idReserva: "56789",
          titulo: "Sala de Reuniones A",
          horaInicio: "10:00",
          horaFin: "11:00",
          sede: "Bogotá",
          localidad: "Teusaquillo",
          capacidad: 20,
          estado: "Activa",
        },
        {
          idReserva: "56790",
          titulo: "Sala de Capacitación B",
          horaInicio: "11:30",
          horaFin: "13:00",
          sede: "Bogotá",
          localidad: "Chapinero",
          capacidad: 15,
          estado: "Cancelada",
        },
      ],
    };
  
    return mockData[fechaSeleccionada] || [];
  };
  