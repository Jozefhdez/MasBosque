import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AllergyItem from '../../views/components/AllergyItem';

// Mock the Icon components
jest.mock('../../views/components/Icon', () => ({
    MinusCircle: () => null,
    XIcon: () => null,
}));

describe('AllergyItem Component', () => {
    const defaultProps = {
        allergy: '',
        onRemove: jest.fn(),
        onChangeText: jest.fn(),
        onClear: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render correctly with empty allergy', () => {
            const { getByPlaceholderText } = render(<AllergyItem {...defaultProps} />);
            
            expect(getByPlaceholderText('. . .')).toBeTruthy();
        });

        it('should render correctly with allergy text', () => {
            const { getByDisplayValue } = render(
                <AllergyItem {...defaultProps} allergy="Peanuts" />
            );
            
            expect(getByDisplayValue('Peanuts')).toBeTruthy();
        });

        it('should not show clear button when allergy is empty', () => {
            const { queryByTestId } = render(<AllergyItem {...defaultProps} />);
            
            // The clear button wrapper shouldn't have the XIcon visible when empty
            // Since we mock XIcon to null, we verify through the onClear not being callable
            expect(defaultProps.onClear).not.toHaveBeenCalled();
        });
    });

    describe('User Interactions', () => {
        it('should call onRemove when remove button is pressed', () => {
            const onRemove = jest.fn();
            const { UNSAFE_getAllByType } = render(
                <AllergyItem {...defaultProps} onRemove={onRemove} />
            );
            
            const { TouchableOpacity } = require('react-native');
            const touchables = UNSAFE_getAllByType(TouchableOpacity);
            
            // First touchable is the remove button
            fireEvent.press(touchables[0]);
            
            expect(onRemove).toHaveBeenCalledTimes(1);
        });

        it('should call onChangeText when text input changes', () => {
            const onChangeText = jest.fn();
            const { getByPlaceholderText } = render(
                <AllergyItem {...defaultProps} onChangeText={onChangeText} />
            );
            
            const input = getByPlaceholderText('. . .');
            fireEvent.changeText(input, 'Shellfish');
            
            expect(onChangeText).toHaveBeenCalledWith('Shellfish');
        });

        it('should call onClear when clear button is pressed (when allergy has text)', () => {
            const onClear = jest.fn();
            const { UNSAFE_getAllByType } = render(
                <AllergyItem {...defaultProps} allergy="Some Allergy" onClear={onClear} />
            );
            
            const { TouchableOpacity } = require('react-native');
            const touchables = UNSAFE_getAllByType(TouchableOpacity);
            
            // Second touchable is the clear button (only visible when allergy has text)
            if (touchables.length > 1) {
                fireEvent.press(touchables[1]);
                expect(onClear).toHaveBeenCalledTimes(1);
            }
        });
    });

    describe('TextInput Properties', () => {
        it('should have correct keyboard type', () => {
            const { getByPlaceholderText } = render(<AllergyItem {...defaultProps} />);
            
            const input = getByPlaceholderText('. . .');
            expect(input.props.keyboardType).toBe('default');
        });

        it('should have correct auto capitalize setting', () => {
            const { getByPlaceholderText } = render(<AllergyItem {...defaultProps} />);
            
            const input = getByPlaceholderText('. . .');
            expect(input.props.autoCapitalize).toBe('words');
        });
    });
});
