import classnames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouteProps, withRouter } from 'react-router-dom';
import { PaletteIcon } from '../../assets/images/customization/PaletteIcon';
import {
    CustomizationFonts,
    CustomizationImages,
    CustomizationSpacing,
    CustomizationThemes,
    TabPanel,
} from '../../components';
import {
    CustomizationDataInterface,
    RootState,
    selectCustomizationData,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
} from '../../modules';

interface ReduxProps {
    customization?: CustomizationDataInterface;
    user: User;
    userLoggedIn: boolean;
}

interface DispatchProps {
    toggleChartRebuild: typeof toggleChartRebuild;
}

interface HistoryProps {
    history: History;
}

type Props = ReduxProps & HistoryProps & RouteProps & DispatchProps & InjectedIntlProps;

interface State {
    currentTabIndex: number;
    isOpen: boolean;
    resetToDefault: boolean;
}

class CustomizationContainer extends React.Component<Props, State> {
    public state = {
        currentTabIndex: 0,
        isOpen: true,
        resetToDefault: false,
    };

    public renderTabs = () => {
        const { customization } = this.props;
        const { currentTabIndex, resetToDefault } = this.state;

        return [
            {
                content: currentTabIndex === 0 ? (
                    <CustomizationThemes
                        translate={this.translate}
                        customization={customization}
                        resetToDefault={resetToDefault}
                        handleTriggerChartRebuild={this.handleTriggerChartRebuild}
                    />
                ) : null,
                label: this.translate('page.body.customization.tabs.themes'),
            },
            {
                content: currentTabIndex === 1 ? <CustomizationFonts translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.fonts'),
            },
            {
                content: currentTabIndex === 2 ? <CustomizationSpacing translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.spacing'),
            },
            {
                content: currentTabIndex === 3 ? <CustomizationImages translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.images'),
            },
        ];
    };

    public renderActionButtons() {
        return (
            <div className="pg-customization__action-buttons">
                <span className="pg-customization__action-buttons__button" onClick={this.handleClickResetButton}>
                    {this.translate('page.body.customization.actionButtons.reset')}
                </span>
                <span className="pg-customization__action-buttons__button">
                    {this.translate('page.body.customization.actionButtons.save')}
                </span>
            </div>
        );
    }

    public render() {
        const { userLoggedIn } = this.props;
        const { currentTabIndex, isOpen } = this.state;

        /*
        if (!userLoggedIn || user.role !== 'superadmin' || !this.handleCheckRoute()) {
            return null;
        }
        */

        if (!userLoggedIn || !this.handleCheckRoute()) {
            return null;
        }

        const customizationClassName = classnames('pg-customization', {
            'pg-customization--hidden': !isOpen,
        });

        return (
            <div className={customizationClassName}>
                <div className="pg-customization__toggler" onClick={e => this.handleToggleIsOpen()}>
                    <PaletteIcon />
                </div>
                <TabPanel
                    panels={this.renderTabs()}
                    onTabChange={this.handleChangeTab}
                    currentTabIndex={currentTabIndex}
                />
                {this.renderActionButtons()}
            </div>
        );
    }

    private handleClickResetButton = () => {
        this.setState(prevState => ({
            resetToDefault: !prevState.resetToDefault,
        }));
    };

    private handleChangeTab = (index: number) => {
        this.setState({
            currentTabIndex: index,
        });
    };

    private handleCheckRoute = () => {
        if (window.location.hash && window.location.hash.substring(1) === 'settings') {
            return true;
        }

        return false;
    };

    private handleToggleIsOpen = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    };

    private handleTriggerChartRebuild = () => {
        this.props.toggleChartRebuild();
    };

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    customization: selectCustomizationData(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    });

// tslint:disable no-any
export const Customization = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(CustomizationContainer) as any) as any);
