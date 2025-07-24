import { render } from "@testing-library/react-native";
import BadScrollExample from "../BadScrollExample";


describe("<BadScrollExample /> component", () => {
    test("Renderea correctamente", () => {
        const { toJSON, getByTestId } = render(<BadScrollExample />);

        expect(toJSON()).toMatchSnapshot();
        expect(getByTestId("activity-indicator")).toBeDefined();
    });

    const fetch = () => {
        return {
            json: () => {
                return {};
                // creamos la funcion para mostrar los 30 elementos
            }
        }
    };
    test("Renderea elementos despues de cargarlos", async () => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue(Array.from({ length: 30 }, (_, i) => ({
                userId: 1,
                id: i + 1,
                title: `Post ${i + 1}`,
                body: `This is the body of post ${i + 1}.`
            }))),
        } as unknown as Response);

        const { findAllByText } = render(<BadScrollExample />);

        const results = await findAllByText(/post/i);
        expect(results.length).toBeGreaterThan(0);
        expect(results).toBeDefined();
    });
});