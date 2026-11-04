import AppShell from "@/components/AppShell";

function SettingTab({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "relative flex h-[46px] items-center px-5 text-[15px] font-semibold transition",
        active
          ? "text-[#4D35F3]"
          : "text-[#746D7D] hover:text-[#2D263E]",
      ].join(" ")}
    >
      {label}

      {active && (
        <span className="absolute inset-x-4 bottom-0 h-[3px] rounded-full bg-[#FF67B6]" />
      )}
    </button>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[#494254]">
        {label}
      </span>

      <input
        defaultValue={value}
        className="h-[48px] w-full rounded-[9px] border border-[#DDD8E5] bg-white px-4 text-[14px] text-[#2F293F] outline-none transition focus:border-[#8068F4] focus:ring-2 focus:ring-[#8068F4]/10"
      />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="px-5 py-5 sm:px-7 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="editorial text-[36px] leading-none tracking-[-0.04em] text-[#171332]">
            Company settings
          </h1>

          <p className="mt-2 text-[14px] text-[#7B7484]">
            Manage your company profile, payment preferences and team settings.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex overflow-x-auto border-b border-[#EAE6EF]">
          <SettingTab label="General" active />
          <SettingTab label="Payment methods" />
          <SettingTab label="Team" />
          <SettingTab label="Notifications" />
        </div>

        {/* Main layout */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          {/* Company information */}
          <section className="rounded-[13px] border border-[#E8E4ED] bg-white p-6">
            <div>
              <h2 className="text-[18px] font-semibold text-[#29233D]">
                Company information
              </h2>

              <p className="mt-1 text-[13px] text-[#8A8393]">
                This information appears across your deals and settlement records.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Company name"
                value="Acme Manufacturing"
              />

              <Field
                label="Industry"
                value="Electronics"
              />

              <div className="md:col-span-2">
                <Field
                  label="Business address"
                  value="Hong Kong SAR"
                />
              </div>

              <Field
                label="Primary contact"
                value="Amanda Chen"
              />

              <Field
                label="Business email"
                value="operations@acmemfg.com"
              />
            </div>

            {/* Save row */}
            <div className="mt-6 flex items-center justify-between border-t border-[#EEEAF2] pt-5">
              <p className="text-[12px] text-[#918A99]">
                Changes are saved to your DealDone workspace.
              </p>

              <button
                type="button"
                className="flex h-[44px] items-center justify-center rounded-[9px] bg-[#FF67B6] px-6 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(255,103,182,0.20)] transition hover:bg-[#F45DAD]"
              >
                Save changes
              </button>
            </div>
          </section>

          {/* Logo / workspace card */}
          <div className="space-y-5">
            <section className="rounded-[13px] border border-[#E8E4ED] bg-white p-5">
              <h2 className="text-[16px] font-semibold text-[#29233D]">
                Company logo
              </h2>

              <p className="mt-1 text-[12px] leading-[1.6] text-[#8A8393]">
                Used across deals, approvals and shared settlement records.
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,#EFEAFF,#FCEAF5)] text-[22px] font-bold text-[#4D35F3] ring-1 ring-[#E8E2F2]">
                  AM
                </div>

                <div>
                  <button
                    type="button"
                    className="h-[40px] rounded-[9px] border border-[#DCD7E3] bg-white px-4 text-[13px] font-semibold text-[#4D35F3] transition hover:bg-[#F8F6FC]"
                  >
                    Upload logo
                  </button>

                  <p className="mt-2 text-[11px] text-[#9B94A3]">
                    PNG, JPG or SVG · Max 2 MB
                  </p>
                </div>
              </div>
            </section>

            {/* Workspace identity */}
            <section className="rounded-[13px] border border-[#E8E4ED] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#29233D]">
                  Workspace
                </h2>

                <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[11px] font-semibold text-[#21865A]">
                  Active
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[12px] text-[#918A99]">
                    Workspace name
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-[#393248]">
                    Acme Manufacturing
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[#918A99]">
                    Deal currency
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-[#393248]">
                    USD
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[#918A99]">
                    Payment provider
                  </p>

                  <div className="mt-1.5 inline-flex items-center rounded-[8px] bg-[#F3F0FB] px-3 py-2 text-[13px] font-bold text-[#33217F]">
                    PayPal
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-[13px] border border-[#E8E4ED] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F1FF] text-[15px]">
                  🔒
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold text-[#393248]">
                    Secure settlement workspace
                  </h3>

                  <p className="mt-1 text-[12px] leading-[1.6] text-[#817A8B]">
                    Payment execution is handled through PayPal after both parties approve the settlement.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}