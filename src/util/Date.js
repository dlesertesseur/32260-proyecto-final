function filterRecordsByLastConnection(registros, minutos) {
  const tiempoLimite = minutos * 60 * 1000; // Convertir minutos a milisegundos
  const ahora = new Date().getTime(); // Obtener el tiempo actual en milisegundos

  const registrosFiltrados = registros.filter((registro) => {
    if (registro.last_connection) {
      const ultimaConexion = new Date(registro.last_connection).getTime(); // Obtener el tiempo de última conexión del registro en milisegundos
      const tiempoTranscurrido = ahora - ultimaConexion; // Calcular el tiempo transcurrido desde la última conexión

      return tiempoTranscurrido > tiempoLimite;
    } else {
      return true;
    }
  });

  return registrosFiltrados;
}

export { filterRecordsByLastConnection };
