import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

import { ConsoleProvider } from "../../state/ConsoleContext";
import ConsoleView from "../ConsoleView";

// Mock postcliService
jest.mock("../../services/postcliService", () => ({
  callPostCli: jest
    .fn()
    .mockImplementation(() => Promise.resolve("mocked response")),
}));

describe("Console Components", () => {
  const renderWithProvider = (component: React.ReactNode) => {
    return render(<ConsoleProvider>{component}</ConsoleProvider>);
  };

  describe("ConsoleView", () => {
    it("renders empty state initially", () => {
      renderWithProvider(<ConsoleView />);
      expect(screen.getByText(/Initializing console/i)).toBeInTheDocument();
    });

    it("renders command and output correctly", () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      // Initial mount message should be displayed
      expect(
        screen.getByText(/Console test component mounted/i)
      ).toBeInTheDocument();
    });
  });

  describe("ConsoleTest", () => {
    it("handles basic test correctly", async () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      const basicTestButton = screen.getByText("Basic Test");
      fireEvent.click(basicTestButton);

      expect(screen.getByText(/Basic test message/i)).toBeInTheDocument();
      expect(screen.getByText(/Another test message/i)).toBeInTheDocument();
      expect(screen.getByText(/And one more message/i)).toBeInTheDocument();
    });

    it("handles command test correctly", async () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      const commandTestButton = screen.getByText("Command Test");

      await act(async () => {
        fireEvent.click(commandTestButton);
      });

      expect(screen.getByText(/Starting command test/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Command test completed successfully/i)
      ).toBeInTheDocument();
    });

    it("handles multiline test correctly", () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      const multilineTestButton = screen.getByText("Multiline Test");
      fireEvent.click(multilineTestButton);

      expect(
        screen.getByText(/Multiple line test message:/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Line 1: Testing console output/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Line 2: With multiple lines/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Line 3: And different content/i)
      ).toBeInTheDocument();
    });

    it("handles error test correctly", () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      const errorTestButton = screen.getByText("Error Test");
      fireEvent.click(errorTestButton);

      expect(
        screen.getByText(/This is a test error message/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/And another error message/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Followed by a normal message/i)
      ).toBeInTheDocument();
    });

    it("handles stress test correctly", async () => {
      renderWithProvider(
        <>
          <ConsoleView />
        </>
      );

      const stressTestButton = screen.getByText("Stress Test");

      await act(async () => {
        fireEvent.click(stressTestButton);
        // Wait for all messages to be displayed
        await new Promise((resolve) => setTimeout(resolve, 5500));
      });

      expect(
        screen.getByText(/Stress test completed successfully/i)
      ).toBeInTheDocument();
    });
  });
});
