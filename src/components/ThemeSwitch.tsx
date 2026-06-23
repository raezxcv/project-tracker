interface ThemeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function DotSvg({ id, className }: { id: string; className: string }) {
  return (
    <svg id={id} className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx={50} cy={50} r={50} />
    </svg>
  );
}

function StarSvg({ id }: { id: string }) {
  return (
    <svg id={id} className="star" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
    </svg>
  );
}

export default function ThemeSwitch({ checked, onChange }: ThemeSwitchProps) {
  return (
    <label className="theme-switch" aria-label={checked ? "Switch to light theme" : "Switch to dark theme"}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="slider round">
        <span className="sun-moon">
          <DotSvg id="moon-dot-1" className="moon-dot" />
          <DotSvg id="moon-dot-2" className="moon-dot" />
          <DotSvg id="moon-dot-3" className="moon-dot" />
          <DotSvg id="light-ray-1" className="light-ray" />
          <DotSvg id="light-ray-2" className="light-ray" />
          <DotSvg id="light-ray-3" className="light-ray" />
          <DotSvg id="cloud-1" className="cloud-dark" />
          <DotSvg id="cloud-2" className="cloud-dark" />
          <DotSvg id="cloud-3" className="cloud-dark" />
          <DotSvg id="cloud-4" className="cloud-light" />
          <DotSvg id="cloud-5" className="cloud-light" />
          <DotSvg id="cloud-6" className="cloud-light" />
        </span>
        <span className="stars">
          <StarSvg id="star-1" />
          <StarSvg id="star-2" />
          <StarSvg id="star-3" />
          <StarSvg id="star-4" />
        </span>
      </span>
    </label>
  );
}
