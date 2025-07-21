import { render } from '@testing-library/react-native';

import ChatResponse from '../components/ChatResponse';

describe('ChatResponse Component', () => {
    test('renders correctly given a response', () => {
        const { getByText } = render(<ChatResponse response="Hello, world!" />);
        const messageElement = getByText('Hello, world!');
        expect(messageElement).toBeTruthy();
        expect(messageElement.props.style).toEqual(expect.objectContaining({ fontSize: 14 }));
    });

    test('renders empty response correctly', () => {
        const { queryByText } = render(<ChatResponse response="" />);
        const messageElement = queryByText('');
        expect(messageElement).toBeNull();
    });
});