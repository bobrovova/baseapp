import classnames from 'classnames';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { ArrowIcon } from '../../../../assets/images/customization/ArrowIcon';
import { ThemeColorTitleInterface } from '../../../../themes';
import { handleConvertColorCode } from '../index';

interface OwnProps {
    handleCloseColorSettings: () => void;
    item: ThemeColorTitleInterface;
    translate: (key: string) => string;
}

interface State {
    currentItemColor?: string;
}

type Props = OwnProps;

export class ColorSettings extends React.Component<Props, State> {
    public state = {
        currentItemColor: undefined,
    };

    public componentDidUpdate(prevProps: Props) {
        const { item } = this.props;

        if (item && prevProps.item && JSON.stringify(item) !== JSON.stringify(prevProps.item)) {
            this.handleSetCurrentItemColor();
        }
    }

    public render() {
        const {
            handleCloseColorSettings,
            item,
            translate,
        } = this.props;

        const settingsClass = classnames('pg-customization-color-settings', {
            'pg-customization-color-settings--open': item.key,
        });

        return (
            <div className={settingsClass}>
                <div className="pg-customization-color-settings__header">
                    <div
                        className="pg-customization-color-settings__header__chevron"
                        onClick={e => handleCloseColorSettings()}
                    >
                        <ArrowIcon />
                    </div>
                    {item.title ? <span>{translate(item.title)}</span> : null}
                </div>
                <div className="pg-customization-color-settings__body">
                    <SketchPicker
                        color={ this.getCurrentItemColor(item) }
                        onChangeComplete={ this.setCurrentItemColor }
                    />
                </div>
            </div>
        );
    }

    private getCurrentItemColor = (item: ThemeColorTitleInterface) => {
        const { currentItemColor } = this.state;
        const bodyStyles = window.getComputedStyle(document.body);
        const grbItemColor = handleConvertColorCode(item.key);

        return currentItemColor || bodyStyles.getPropertyValue(grbItemColor);
    };

    private setCurrentItemColor = color => {
        const { item } = this.props;
        const rootElement = document.documentElement;
        const newItemColor = color && color.rgb && `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a}`;

        if (rootElement && newItemColor) {
            this.handleSetCurrentItemColor(newItemColor);
            rootElement.style.setProperty(item.key, newItemColor);
        }
    };

    private handleSetCurrentItemColor = (colorToSet?: string) => {
        if (colorToSet) {
            this.setState({ currentItemColor: `rgba(${colorToSet})` });
        } else {
            this.setState({ currentItemColor: '' });
        }
    };
}
