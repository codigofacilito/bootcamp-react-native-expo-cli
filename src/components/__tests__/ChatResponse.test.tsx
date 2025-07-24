import { render } from "@testing-library/react-native";

import ChatResponse from "../ChatResponse";

describe("<ChatResponse/> component", () => {
    test("Renderea correctamente dada una respuesta como prop", () => {
        const { getByText } = render(<ChatResponse response="Hola!" />);

        const component = getByText("Hola!");

        expect(component).toBeTruthy();
        expect(component).toBeDefined();

        expect(component.props.style).toEqual({ fontSize: 14 });
    });

    test("Hace match con el snapshoot", () => {
        const { toJSON } = render(<ChatResponse response="Hola Mundo 2s!" />);
        expect(toJSON()).toMatchSnapshot();
    });
});