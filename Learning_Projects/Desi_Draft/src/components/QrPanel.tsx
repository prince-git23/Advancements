import { QRCodeSVG } from 'qrcode.react';

/** Loaded only when the WhatsApp dialog opens, so qrcode.react stays off the first screen. */
export function QrPanel({ value }: { value: string }) {
  return (
    <div className="mx-auto mb-6 grid w-fit place-items-center rounded-[16px] bg-white p-4">
      <QRCodeSVG value={value} size={170} bgColor="#ffffff" fgColor="#0A0A0A" level="M" />
    </div>
  );
}
