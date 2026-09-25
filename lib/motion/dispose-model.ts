import { Mesh, Texture, type Object3D } from "three";

/** A model may finish loading after its owning effect has been replaced. */
export function disposeUnclaimedModel(root: Object3D) {
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      for (const value of Object.values(material)) if (value instanceof Texture) value.dispose();
      material.dispose();
    }
  });
}
