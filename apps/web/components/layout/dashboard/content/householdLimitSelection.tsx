"use client";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import EstateCreationSteps from "./estateStepper";
import {
  ApartmentOutlined,
  ArrowBackOutlined,
  ArrowForwardOutlined,
  BusinessOutlined,
  CheckCircleOutlined,
  DomainOutlined,
  Error,
  HomeOutlined,
  LocationCityOutlined,
  LocationOnOutlined,
  Security,
  Support,
  Upgrade,
} from "@mui/icons-material";
import { useSubscriptionPlans } from "../../../../hooks/useSubscriptionPlans";
import { showToast } from "../../../../utils/toast";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { estateActions } from "../../../../lib/features/estate/estateSlice";
import { RootState } from "../../../../lib/store";

const HouseholdLimitSelection = ({
  nextStepHandler,
  prevStepHandler,
}: {
  nextStepHandler: () => void;
  prevStepHandler: () => void;
}) => {
  const dispatch = useDispatch();
  const storedEstate = useSelector((state: RootState) => state.estate);
  const { upsertHousehold } = estateActions;
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<string | null>(
    "monthly",
  );
  const { isError, error, data, isPending, refetch } = useSubscriptionPlans();
  const { plan, period, households, amount } = storedEstate;

  if (isPending) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size="large" />
        <Typography
          sx={{
            fontSize: { xs: 10, md: 14 },
          }}
        >
          Loading subscription plans
        </Typography>
      </Box>
    );
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showToast.error(errorMessage);
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Error fontSize="large" />
        <Button onClick={() => refetch()} variant="contained">
          Try again
        </Button>
      </Box>
    );
  }

  const plans = data.data?.plansData;

  const handleSubscriptionPlan = (
    event: MouseEvent<HTMLElement>,
    period: string | null,
  ) => {
    if (!period) return;
    const plan = plans?.find((item) => item.id === selectedPlanId);
    setSubscriptionPeriod(period);
    dispatch(
      upsertHousehold({
        period: period,
        amount: period === "monthly" ? plan?.monthly_fee : plan?.yearly_fee,
      }),
    );
  };

  const handlePlanChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPlanId = event.target.value;
    setSelectedPlanId(nextPlanId);
    const plan = plans?.find((item) => item.id === nextPlanId);
    dispatch(
      upsertHousehold({
        period: subscriptionPeriod,
        households: plan?.household_limit,
        amount:
          subscriptionPeriod === "monthly"
            ? plan?.monthly_fee
            : plan?.yearly_fee,
        plan: plan?.name,
      }),
    );
  };

  const getPlanIcon = (limit: number) => {
    if (limit <= 50) return <HomeOutlined />;
    if (limit <= 100) return <ApartmentOutlined />;
    if (limit <= 150) return <BusinessOutlined />;
    if (limit <= 200) return <DomainOutlined />;
    return <LocationCityOutlined />;
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 5 },
        minHeight: "60vh",
      }}
    >
      <EstateCreationSteps activeStep={1} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          minHeight: "60vh",
        }}
      >
        {/* Household options column UI */}
        <Box
          sx={{
            width: { xs: "100%", md: "66%" },
          }}
        >
          <Paper
            elevation={1}
            sx={{
              width: "100%",
              px: { xs: 1, md: 2 },
              py: { xs: 1, md: 2 },
              mb: { xs: 2, md: 3 },
            }}
            component="form"
          >
            {/* Heading */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: 20, md: 28 },
              }}
            >
              Select Household Limit
            </Typography>
            {/* Subheading */}
            <Typography
              component="p"
              sx={{
                fontSize: { xs: 12, md: 14 },
                pb: { xs: 2, md: 3 },
                color: "grey",
              }}
            >
              Choose the maximum number of households this estate can manage.
            </Typography>

            {/* Toggle period UI */}
            <ToggleButtonGroup
              value={subscriptionPeriod}
              exclusive
              onChange={handleSubscriptionPlan}
              aria-label="subscription period"
              size="small"
              color="primary"
              sx={{
                mb: { xs: 2, md: 3 },
              }}
            >
              <ToggleButton value="monthly" aria-label="monthly fee">
                <Typography
                  sx={{ px: 2, fontSize: { xs: 12, md: 14 }, fontWeight: 600 }}
                >
                  Monthly
                </Typography>
              </ToggleButton>
              <ToggleButton value="yearly" aria-label="yearly fee">
                <Typography
                  sx={{ px: 2, fontSize: { xs: 12, md: 14 }, fontWeight: 600 }}
                >
                  Yearly
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Households Limit Options */}
            <RadioGroup
              value={selectedPlanId}
              onChange={handlePlanChange}
              sx={{
                gap: 2,
                width: "100%",
              }}
            >
              {plans?.map(
                (plan: {
                  id: string;
                  name: string;
                  household_limit: number;
                  description: string;
                  monthly_fee: number;
                  yearly_fee: number;
                }) => {
                  const isSelected = selectedPlanId === plan.id;

                  return (
                    <FormControlLabel
                      key={plan.id}
                      value={plan.id}
                      control={<Radio sx={{ display: "none" }} />}
                      sx={{
                        m: 0,
                        width: "100%",
                        display: "flex",
                        alignItems: "stretch",
                        "& .MuiFormControlLabel-label": {
                          width: "100%",
                        },
                      }}
                      label={
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: 84,
                            px: { xs: 1.5, md: 2.5 },
                            py: { xs: 1.5, md: 2 },
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1.5, md: 2 },
                            borderRadius: 1.5,
                            border: "1.5px solid",
                            borderColor: isSelected
                              ? "text.primary"
                              : "divider",
                            bgcolor: isSelected
                              ? "action.hover"
                              : "background.paper",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "text.primary",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          {/* Left content */}
                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                              alignItems: "center",
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                flexShrink: 0,
                                borderRadius: 1.5,
                                bgcolor: isSelected
                                  ? "text.primary"
                                  : "action.hover",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isSelected
                                  ? "background.paper"
                                  : "text.primary",
                              }}
                            >
                              {getPlanIcon(plan.household_limit)}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontSize: { xs: 14, md: 16 },
                                  fontWeight: 700,
                                  color: "text.primary",
                                  lineHeight: 1.2,
                                }}
                              >
                                {plan.name} Estate
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: { xs: 10, md: 12 },
                                  color: "success.main",
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                }}
                              >
                                {plan.household_limit} Households
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: { xs: 12, md: 14 },
                                  color: "text.secondary",
                                  lineHeight: 1.4,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {plan.description}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Right-aligned price */}
                          <Box
                            sx={{
                              ml: "auto",
                              minWidth: { xs: 86, md: 110 },
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                fontSize: { xs: 20, md: 24 },
                                fontWeight: 800,
                                color: "text.primary",
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                              }}
                            >
                              &#8358;
                              {subscriptionPeriod === "monthly"
                                ? plan.monthly_fee.toLocaleString()
                                : plan.yearly_fee.toLocaleString()}
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: { xs: 11, md: 13 },
                                  fontWeight: 500,
                                  color: "text.secondary",
                                  ml: 0.25,
                                }}
                              >
                                {subscriptionPeriod === "monthly"
                                  ? "/mo"
                                  : "/yr"}
                              </Typography>
                            </Typography>
                          </Box>

                          {/* Selected check icon */}
                          <Box
                            sx={{
                              width: 24,
                              display: "flex",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && (
                              <CheckCircleOutlined
                                sx={{
                                  fontSize: 22,
                                  color: "success.main",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  );
                },
              )}
            </RadioGroup>
          </Paper>

          {/* Nav Buttons UI */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              mb: { xs: 3, md: 4 },
              gap: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackOutlined />}
              sx={{
                px: 3,
                py: 1,
                border: "1px solid grey",
              }}
              onClick={() => prevStepHandler()}
            >
              Back
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardOutlined />}
              sx={{
                px: 3,
                py: 1,
                bgcolor: "primary.main",
              }}
              onClick={() => nextStepHandler()}
            >
              Proceed to payment
            </Button>
          </Box>
        </Box>

        {/* Right Column UI */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: "33%" },
            pb: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              py: { xs: 1, md: 2 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#71BAE0",
              border: "1px solid grey",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 14, md: 18 },
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Summary Capacity Overview
            </Typography>
          </Box>
          <Box
            sx={{
              py: { xs: 1, md: 2 },
              bgcolor: "white",
              px: { xs: 1, md: 2 },
              border: "1px solid grey",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopStyle: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                pb: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  color: "grey",
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                Selected Plan
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                {plan}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                pb: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  color: "grey",
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                Household Limit
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                {households}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                pb: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  color: "grey",
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                Billing Cycle
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                {period}
              </Typography>
            </Box>
            <Divider
              sx={{
                mb: { xs: 1, md: 2 },
                borderBottomWidth: 2,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                pb: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Total Price
              </Typography>
              <Typography>{amount?.toLocaleString()}</Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid grey",
                bgcolor: "white",
                p: { xs: 1, md: 2 },
                mb: { xs: 1, md: 2 },
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 14 },
                  fontWeight: 600,
                  color: "grey",
                }}
              >
                You can upgrade later if your estate grows
              </Typography>
            </Box>
            <Box
              sx={{
                pb: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  pb: { xs: 1, md: 2 },
                  fontWeight: 700,
                  fontSize: { xs: 12, md: 14 },
                  color: "grey",
                }}
              >
                Included Benefits
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  pb: { xs: 1, md: 2 },
                }}
              >
                <LocationOnOutlined
                  fontSize="small"
                  sx={{
                    color: "green",
                  }}
                />
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: { xs: 12, md: 14 },
                  }}
                >
                  Enterprise Data Encryption
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  pb: { xs: 1, md: 2 },
                }}
              >
                <Support
                  fontSize="small"
                  sx={{
                    color: "green",
                  }}
                />
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: { xs: 12, md: 14 },
                  }}
                >
                  24/7 Premium Support
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  pb: { xs: 1, md: 2 },
                }}
              >
                <Upgrade
                  fontSize="small"
                  sx={{
                    color: "green",
                  }}
                />
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: { xs: 12, md: 14 },
                  }}
                >
                  Upgrade Anytime
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  pb: { xs: 1, md: 2 },
                }}
              >
                <Security
                  fontSize="small"
                  sx={{
                    color: "green",
                  }}
                />
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: { xs: 12, md: 14 },
                  }}
                >
                  Secure Resident Management
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HouseholdLimitSelection;
