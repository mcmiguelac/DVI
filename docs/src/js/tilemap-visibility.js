/**
  * Una pequeña clase auxiliar que puede tomar el control de nuestra capa de sombra en mosaico. 
  * Realiza un seguimiento de la sala que está actualmente activa.
  */
export default class TilemapVisibility {
  constructor(shadowLayer) {
    this.shadowLayer = shadowLayer;
    this.activeRoom = null;
  }

  setActiveRoom(room) {
    // Solo necesitamos actualizar los mosaicos si la sala activa ha cambiado
    if (room !== this.activeRoom) {
      this.setRoomAlpha(room, 0); // Hacer visible la nueva sala
      if (this.activeRoom) this.setRoomAlpha(this.activeRoom, 0.75); // Atenúa la habitación vieja
      this.activeRoom = room;
    }
  }

  // Ayudante para establecer el alfa en todos los mosaicos dentro de una habitación
  setRoomAlpha(room, alpha) {
    this.shadowLayer.forEachTile(
      t => (t.alpha = alpha),
      this,
      room.x,
      room.y,
      room.width,
      room.height
    );
  }
}
