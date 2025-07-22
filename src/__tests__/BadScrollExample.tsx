import { render, waitFor } from "@testing-library/react-native";

import BadScrollExample from "../components/BadScrollExample";

describe("BadScrollExample Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<BadScrollExample />);
    expect(toJSON()).toMatchSnapshot();
  });

  test("renders loading indicator initially", () => {
    const { getByTestId } = render(<BadScrollExample />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  test("renders items after loading", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
        json: jest.fn().mockResolvedValue(Array.from({ length: 30 }, (_, i) => ({
            userId: 1,
            id: i + 1,
            title: `Post ${i + 1}`,
            body: `This is the body of post ${i + 1}.`
        }))),
    } as unknown as Response);
    
    const { findAllByText } = render(<BadScrollExample />);
    const items = await findAllByText(/post/i);
    expect(items.length).toBeGreaterThan(0);
  });

  test("render an error if fetch fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    const { findByTestId } = render(<BadScrollExample />);

    waitFor(() => {
      expect(findByTestId("error-indicator")).toBeTruthy();
    });
  });
});