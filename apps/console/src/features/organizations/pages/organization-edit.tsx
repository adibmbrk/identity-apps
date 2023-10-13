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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";
import { Dispatch } from "redux";
import { AppConstants, FeatureConfigInterface, history } from "../../core";
import { getOrganization, useAuthorizedOrganizationsList } from "../api";
import { EditOrganization } from "../components/edit-organization/edit-organization";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import { OrganizationResponseInterface } from "../models";

interface OrganizationEditPagePropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface, RouteChildrenProps{
}

const OrganizationEditPage: FunctionComponent<OrganizationEditPagePropsInterface> = (
    props: OrganizationEditPagePropsInterface
): ReactElement => {

    const {
        featureConfig,
        location
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>();
    const [ isReadOnly, setIsReadOnly ] = useState(true);
    const [ isAuthorizedOrganization, setIsAuthorizedOrganization ] = useState(false);
    const [ filterQuery, setFilterQuery ] = useState<string>("");


    useEffect(() => {
        setIsReadOnly(
            !isFeatureEnabled(
                featureConfig?.organizations,
                OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE")
            ) || organization?.status !== "ACTIVE" || !isAuthorizedOrganization);
    }, [ featureConfig, organization, isAuthorizedOrganization ]);

    const {
        data: authorizedOrganizationList,
        isLoading: isAuthorizedOrganizationListRequestLoading,
        error: authorizedListFetchRequestError
    } = useAuthorizedOrganizationsList(filterQuery, 10, null, null, false);

    /**
     * Handles the authorized list fetch request error.
     */
    useEffect(() => {
        if (!authorizedListFetchRequestError) {
            return;
        }

        handleGetAuthoriziedListCallError(authorizedListFetchRequestError);
    }, [ authorizedListFetchRequestError ]);

    /**
     * Handle check for authorized organization.
     */
    useEffect(() => {
        if (!authorizedOrganizationList) {
            return;
        }

        setIsAuthorizedOrganization(authorizedOrganizationList.organizations?.length === 1);
    }, [ authorizedOrganizationList ]);

    const handleGetAuthoriziedListCallError = (error: any) => {
        if (error?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: error?.response?.data?.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.organizations.notifications." +
                        "getOrganizationList.error.message"
                    )
                })
            );

            return;
        }
        dispatch(
            addAlert({
                description: t(
                    "console:manage.features.organizations.notifications.getOrganizationList" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.organizations.notifications." +
                    "getOrganizationList.genericError.message"
                )
            })
        );

        return;
    };

    const getOrganizationData: (organizationId: string) => void = useCallback((organizationId: string): void => {
        getOrganization(organizationId)
            .then((organization: OrganizationResponseInterface) => {
                setOrganization(organization);
                setFilterQuery("name eq " + organization?.name);
            }).catch((error: any) => {
                if (error?.description) {
                    dispatch(addAlert({
                        description: error.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.organizations.notifications.fetchOrganization." +
                            "genericError.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.organizations.notifications.fetchOrganization." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.organizations.notifications.fetchOrganization." +
                        "genericError.message")
                }));
            });
    }, [ dispatch, t ]);

    useEffect(() => {
        const path: string[] = location.pathname.split("/");
        const id: string = path[path.length - 1];

        getOrganizationData(id);
    }, [ location, getOrganizationData ]);

    const goBackToOrganizationList: () => void = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATIONS")),[ history ]
    );


    return (
        <PageLayout
            isLoading={ isAuthorizedOrganizationListRequestLoading }
            title={ organization?.name ?? t("console:manage.features.organizations.title") }
            pageTitle={ organization?.name ?? t("console:manage.features.organizations.title") }
            description={ t("console:manage.features.organizations.edit.description") }
            image={ (
                <GenericIcon
                    defaultIcon
                    relaxed="very"
                    shape="rounded"
                    size="x50"
                    icon={ OrganizationIcon }
                />
            ) }
            backButton={ {
                "data-testid": "org-mgt-edit-org-back-button",
                onClick: goBackToOrganizationList,
                text: t("console:manage.features.organizations.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganization
                organization={ organization }
                isReadOnly={ isReadOnly }
                featureConfig={ featureConfig }
                onOrganizationUpdate={ getOrganizationData }
                onOrganizationDelete={ goBackToOrganizationList }
            />
        </PageLayout>
    );
};

export default OrganizationEditPage;
