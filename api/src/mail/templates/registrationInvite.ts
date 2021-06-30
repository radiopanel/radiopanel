export const registrationInvite = `
<mjml>
  <mj-head>
    <mj-title>RadioPanel</mj-title>
    <mj-preview>Someone has invited you to {{ tenant.name }}</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="{{ config.emailBackgroundColor }}" width="600px">
  <mj-section full-width="full-width" background-color="{{ config.emailSecondaryColor }}" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="{{ config.frontendBaseUrl }}{{ config.emailLogo }}" alt="" align="center" width="150px" padding-bottom="30px" />
      </mj-column>
    </mj-section>
    <mj-wrapper padding-top="40px" padding-bottom="0" css-class="body-section">
      <mj-section border-radius="20px 20px 0 0" padding-left="15px" padding-right="15px" background-color="{{ config.emailPrimaryColor }}"></mj-section>
      <mj-section border-radius="0 0 20px 20px" padding-left="15px" padding-right="15px" background-color="{{ config.emailBoxBackgroundColor }}">
        <mj-column width="100%">
          <mj-text color="{{ config.emailTextColor }}" font-weight="bold" font-size="20px">
            You are invited!
          </mj-text>
          <mj-text color="{{ config.emailTextColor }}" font-size="16px">
            Hey there,
          </mj-text>
          <mj-text color="{{ config.emailTextColor }}" font-size="16px">
            Someone has invited you to {{ tenant.name }}
          </mj-text>
          <mj-text color="{{ config.emailTextColor }}" font-size="16px">
            If you want to accept the invite, simply press the "Join now" button down below. If you think you have been invited by accident you can safely ignore this email.
          </mj-text>
          <mj-button border-radius="50px" background-color="{{ config.emailPrimaryColor }}" align="center" color="{{ config.emailButtonTextColor }}" font-size="17px" font-weight="bold" href="{{ config.frontendBaseUrl }}/onboarding/register/{{ invite.uuid }}" width="300px">
            Join {{ tenant.name }} now
          </mj-button>
        </mj-column>
      </mj-section>
    </mj-wrapper>

    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="{{ config.emailFooterTextColor }}" font-size="11px" align="center" line-height="16px">
            &copy; {{ tenant.name }}, All Rights Reserved.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`