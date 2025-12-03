import React from 'react';
import { render } from '@testing-library/react-native';
import {
    HomeIcon,
    BackChevronIcon,
    OpenEyeIcon,
    CloseEyeIcon,
    XIcon,
    SOSButton,
    SOSButtonDesign,
    Pencil,
    MinusCircle,
    PlusCircle,
    UserIcon,
    PinIcon,
    BluetoothIcon,
} from '../../views/components/Icon';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: (props: any) => <View {...props} testID="svg" />,
        Path: (props: any) => <View {...props} testID="path" />,
    };
});

describe('Icon Components', () => {
    describe('HomeIcon', () => {
        it('should render with default props', () => {
            const { getByTestId } = render(<HomeIcon />);
            const svg = getByTestId('svg');
            
            expect(svg.props.width).toBe(24);
            expect(svg.props.height).toBe(24);
        });

        it('should render with custom size', () => {
            const { getByTestId } = render(<HomeIcon size={32} />);
            const svg = getByTestId('svg');
            
            expect(svg.props.width).toBe(32);
            expect(svg.props.height).toBe(32);
        });

        it('should render with custom color', () => {
            const { getByTestId } = render(<HomeIcon color="#FF0000" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.stroke).toBe('#FF0000');
        });
    });

    describe('BackChevronIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<BackChevronIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('OpenEyeIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<OpenEyeIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('CloseEyeIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<CloseEyeIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('XIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<XIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });

        it('should accept custom props', () => {
            const { getByTestId } = render(<XIcon size={16} color="#000" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.width).toBe(16);
            expect(svg.props.stroke).toBe('#000');
        });
    });

    describe('SOSButton', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<SOSButton />);
            expect(getByTestId('svg')).toBeTruthy();
        });

        it('should use fill instead of stroke', () => {
            const { getByTestId } = render(<SOSButton color="#BB0003" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.fill).toBe('#BB0003');
        });
    });

    describe('SOSButtonDesign', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<SOSButtonDesign />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('Pencil', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<Pencil />);
            expect(getByTestId('svg')).toBeTruthy();
        });

        it('should use fill color', () => {
            const { getByTestId } = render(<Pencil color="#003706" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.fill).toBe('#003706');
        });
    });

    describe('MinusCircle', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<MinusCircle />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('PlusCircle', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<PlusCircle />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('UserIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<UserIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });

        it('should use fill color', () => {
            const { getByTestId } = render(<UserIcon color="#003706" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.fill).toBe('#003706');
        });
    });

    describe('PinIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<PinIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });
    });

    describe('BluetoothIcon', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(<BluetoothIcon />);
            expect(getByTestId('svg')).toBeTruthy();
        });

        it('should accept custom size and color', () => {
            const { getByTestId } = render(<BluetoothIcon size={48} color="#0000FF" />);
            const svg = getByTestId('svg');
            
            expect(svg.props.width).toBe(48);
            expect(svg.props.height).toBe(48);
            expect(svg.props.stroke).toBe('#0000FF');
        });
    });

    describe('Default Props', () => {
        it('all icons should use default size of 24', () => {
            const icons = [
                <HomeIcon key="home" />,
                <BackChevronIcon key="back" />,
                <OpenEyeIcon key="open" />,
                <CloseEyeIcon key="close" />,
                <XIcon key="x" />,
                <MinusCircle key="minus" />,
                <PlusCircle key="plus" />,
                <PinIcon key="pin" />,
                <BluetoothIcon key="bt" />,
            ];

            icons.forEach((icon) => {
                const { getByTestId, unmount } = render(icon);
                const svg = getByTestId('svg');
                expect(svg.props.width).toBe(24);
                expect(svg.props.height).toBe(24);
                unmount();
            });
        });

        it('all icons should use default color of #fafafa', () => {
            const { getByTestId } = render(<HomeIcon />);
            const svg = getByTestId('svg');
            expect(svg.props.stroke).toBe('#fafafa');
        });
    });
});
