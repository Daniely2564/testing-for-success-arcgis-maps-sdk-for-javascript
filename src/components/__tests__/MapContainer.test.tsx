import { render, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import MapContainer from "../MapContainer";

vi.mock("@arcgis/core/layers/GraphicsLayer", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      const graphics = {
        removeAll: () => null,
        push: () => null,
      };
      return {
        graphics,
      };
    }),
  };
});

vi.mock("@arcgis/core/Graphic", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {};
    }),
  };
});

vi.mock("@arcgis/core/symbols/SimpleMarkerSymbol", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {};
    }),
  };
});

vi.mock("@arcgis/core/geometry/Point", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe("MapContainer", () => {
  test("webgl enabled", () => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    expect(gl).not.toBeNull();
  });

  test("renders and trigger onMapLoad when map is ready", async () => {
    const callback = vi.fn();

    render(
      <MapContainer
        onMapLoad={callback}
        onMapClick={vi.fn()}
        location={null}
        setLocation={() => null}
        observations={[]}
      />
    );

    await waitFor(() => expect(callback).toHaveBeenCalled(), {
      timeout: 10_000,
      onTimeout(error) {
        throw new Error(
          error.message +
            "\n\nMake sure you are calling onMapLoad in the useEffect hook."
        );
      },
    });
  });
});
