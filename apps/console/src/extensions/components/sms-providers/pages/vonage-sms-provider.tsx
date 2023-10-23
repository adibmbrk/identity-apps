/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import {
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { SMSProviderConstants } from "../constants";

interface VonageSMSProviderPageInterface extends IdentifiableComponentInterface {
    isReadOnly: boolean;
    onSubmit: (values: any) => void;
}

const VonageSMSProvider: FunctionComponent<VonageSMSProviderPageInterface> = (
    props: VonageSMSProviderPageInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        isReadOnly,
        onSubmit
    } = props;

    const { t } = useTranslation();

    return (
        <div>
            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <h2>Vonage Settings</h2>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column>
                            <FinalFormField
                                key={ "key" }
                                width={ 16 }
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                ariaLabel={ "key" }
                                readOnly={ isReadOnly }
                                required={ true }
                                data-componentid={ `${componentId}-${"key"}` }
                                name={ "key" }
                                type="text"
                                label={ t("extensions:develop.smsProviders.form.vonage.accountSID.label") }
                                placeholder={ t("extensions:develop.smsProviders.form.vonage.accountSID.placeholder") }
                                helperText={ t("extensions:develop.smsProviders.form.vonage.accountSID.hint") }
                                component={ TextFieldAdapter }
                                maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                InputProps={ {
                                    endAdornment: ""
                                } }
                                autoComplete="new-password"
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <FinalFormField
                                key={ "secret" }
                                width={ 16 }
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                ariaLabel="Password Field"
                                readOnly={ isReadOnly }
                                required={ true }
                                data-componentid={ `${componentId}-${"secret"}` }
                                name={ "secret" }
                                inputType="password"
                                type="password"
                                label={ t("extensions:develop.smsProviders.form.vonage.authToken.label") }
                                placeholder={ t("extensions:develop.smsProviders.form.vonage.authToken.placeholder") }
                                helperText={ t("extensions:develop.smsProviders.form.vonage.authToken.hint") }
                                component={ TextFieldAdapter }
                                maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                InputProps={ {
                                    endAdornment: ""
                                } }
                                autoComplete="new-password"
                            />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={ 2 }>
                        <Grid.Column>
                            <FinalFormField
                                key={ "sender" }
                                width={ 16 }
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                ariaLabel={ "sender" }
                                readOnly={ isReadOnly }
                                required={ true }
                                data-componentid={ `${componentId}-${"sender"}` }
                                name={ "sender" }
                                type="text"
                                label={ t("extensions:develop.smsProviders.form.vonage.sender.label") }
                                placeholder={ t("extensions:develop.smsProviders.form.vonage.sender.placeholder") }
                                helperText={ t("extensions:develop.smsProviders.form.vonage.sender.hint") }
                                component={ TextFieldAdapter }
                                maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                InputProps={ {
                                    endAdornment: ""
                                } }
                                autoComplete="new-password"
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden />
                    <Grid.Row columns={ 1 } className="mt-6">
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <PrimaryButton
                                size="small"
                                onClick={ onSubmit }
                                disabled={ isReadOnly }
                                ariaLabel="SMS provider form update button"
                                data-componentid={ `${componentId}-update-button` }
                                readOnly={ isReadOnly }
                            >
                                { "Submit" }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>

        </div>
    );
};

export default VonageSMSProvider;
