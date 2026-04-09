export const EVENT_SPACE_TYPE = "Espacio de eventos";
export const EVENT_EMAIL = "reservas.campus@ucompensar.edu.co";
export const DEFAULT_EMAIL = "admon.campus@ucompensar.edu.co";

export const getContactEmailBySpaceType = (tipo) => {
  return tipo === EVENT_SPACE_TYPE ? EVENT_EMAIL : DEFAULT_EMAIL;
};
