const salas = [
  "Sala de Reuniones A",
  "Sala de Conferencias B",
  "Sala de Capacitación C",
  "Sala de Reuniones D",
  "Sala Ejecutiva",
];

const generateRandomEvents = (startDate = new Date(), days = 31) => {
  const events = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < days; day++) {
    const numEvents = Math.floor(Math.random() * 4) + 2; // 2-5 eventos por día
    
    for (let i = 0; i < numEvents; i++) {
      const randomSala = salas[Math.floor(Math.random() * salas.length)];
      const randomHour = Math.floor(Math.random() * 9) + 8; // 8 AM - 5 PM
      const randomDuration = Math.floor(Math.random() * 3) + 1; // 1-3 horas
      
      const eventDate = new Date(currentDate);
      eventDate.setHours(randomHour, 0, 0);
      
      const endDate = new Date(eventDate);
      endDate.setHours(randomHour + randomDuration);

      events.push({
        title: randomSala,
        start: eventDate.toISOString(),
        end: endDate.toISOString(),
        desc: `Reserva en ${randomSala}`,
        // Agregamos algunos detalles adicionales que podrían ser útiles
        resourceId: randomSala.toLowerCase().replace(/\s+/g, '-'),
        capacity: Math.floor(Math.random() * 20) + 10, // 10-30 personas
        location: Math.random() > 0.5 ? 'Bogotá' : 'Villavicencio',
      });
    }
    
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
};

export { generateRandomEvents, salas }; 