import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
import { LandingLaunchBlock } from '../../components';


type Props = RouteProps & InjectedIntlProps;

class Landing extends React.Component<Props> {

    public render() {
        return (
            <div className="pg-landing-screen">
                <LandingLaunchBlock translate={this.translate} />
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const LandingScreen = withRouter(injectIntl(Landing));
