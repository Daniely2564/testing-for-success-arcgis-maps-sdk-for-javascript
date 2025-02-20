import type { Meta, StoryObj } from "@storybook/react";
import DataEntry from "../components/DataEntry";
import MapContainer from "../components/MapContainer";
import { waitFor, userEvent } from "@storybook/testing-library";
import { sendkeys } from "../test-utils/interactions";
import { loadObservations, saveObservation } from "../api/fetchData";

import { expect } from "@storybook/jest";

import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";

const meta = {
  title: "Data Entry",
  component: DataEntry,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    location: {
      latitude: 0,
      longitude: 0,
    },
  },
  decorators: [
    (Story, { args }) => {
      const [currentPoint, setCurrentPoint] = useState<{
        latitude: number;
        longitude: number;
      } | null>(args.location);
      const [loadedPoints, setLoadedPoints] = useState([]);

      const onSaveObservation = async (observation: string) => {
        if (currentPoint !== null) {
          console.log("Saving observation");
          await saveObservation({
            location: currentPoint,
            observation,
          });
          await loadObservations().then(setLoadedPoints).catch(console.error);
          setCurrentPoint(null);
        }
      };

      // Load all of the current observations to the map
      useEffect(() => {
        loadObservations().then(setLoadedPoints).catch(console.error);
      }, []);

      useEffect(() => {
        setCurrentPoint(args.location);
      }, [args.location]);

      return (
        <CalciteShell contentBehind>
          <CalciteShellPanel slot="panel-start" position="start">
            <CalcitePanel heading="Data Entry">
              <Story
                args={{
                  ...args,
                  location: currentPoint,
                  onSubmit: onSaveObservation,
                }}
              />
            </CalcitePanel>
          </CalciteShellPanel>
          <MapContainer
            onMapLoad={console.log}
            onMapClick={(mapPoint) => setCurrentPoint(mapPoint)}
            loadedPoints={loadedPoints}
          />
        </CalciteShell>
      );
    },
  ],
  play: async () => {
    await waitFor(() =>
      expect(document.querySelector("#textInput")).not.toBeNull()
    );

    const observation = "This tests observation";

    (document.querySelector("#textInput") as HTMLInputElement).focus();

    await sendkeys(
      document.querySelector("#textInput") as HTMLInputElement,
      observation,
      100
    );

    await userEvent.tab();

    await expect(document.querySelector("#textInput")).toHaveValue(observation);

    await userEvent.click(
      document.querySelector("#submitText") as HTMLButtonElement
    );
  },
} satisfies Meta<typeof DataEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Test: Story = {
  args: {
    location: {
      latitude: 34.0250437858476,
      longitude: -118.80448501586915,
    },
    onSubmit: (observation) => console.log(observation),
  },
};
// TODO: Add docs on testings we covered, how to run them, e.g. vitest, storybook.
// TODO: try to implement screenshot testing.
// TODO
