/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight, FlaskConical, X } from "lucide-react";
import {
  getDefaultLocalAuthProfile,
  isLocalAuthBypassEnabled,
  LOCAL_AUTH_ROLES,
  LOCAL_AUTH_SESSION_CLEARED,
  startLocalAuthSession,
} from "./localAuthBypass";
import "./localAuth.css";

const LocalAuthSelector = ({ children, onSessionChange }) => {
  const [profile, setProfile] = useState(getDefaultLocalAuthProfile);
  const [hasSession, setHasSession] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) dialogRef.current.showModal();
    else {
      dialogRef.current.close();
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSessionCleared = () => {
      onSessionChange();
      setHasSession(false);
      setIsOpen(true);
    };
    window.addEventListener(LOCAL_AUTH_SESSION_CLEARED, handleSessionCleared);
    return () => window.removeEventListener(LOCAL_AUTH_SESSION_CLEARED, handleSessionCleared);
  }, [onSessionChange]);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (!startLocalAuthSession(profile)) return;
      onSessionChange();
      setSessionVersion((version) => version + 1);
      setHasSession(true);
      setIsOpen(false);
      setError("");
    } catch (sessionError) {
      setError(sessionError.message);
    }
  };

  return (
    <>
      {hasSession ? (
        <Fragment key={sessionVersion}>{children}</Fragment>
      ) : <div className="local-auth-background" />}
      {hasSession && (
        <button
          ref={triggerRef}
          type="button"
          className="local-auth-trigger"
          aria-label="Cambiar sesion local"
          onClick={() => {
            setProfile(getDefaultLocalAuthProfile());
            setError("");
            setIsOpen(true);
          }}
        >
          <FlaskConical size={20} aria-hidden="true" />
          <span className="local-auth-tooltip" role="tooltip">Cambiar sesion local</span>
        </button>
      )}
      <dialog
        ref={dialogRef}
        className="local-auth-dialog"
        aria-labelledby="local-auth-title"
        onCancel={(event) => {
          event.preventDefault();
          if (hasSession) setIsOpen(false);
        }}
      >
        <div className="local-auth-heading">
          <div className="local-auth-badge"><FlaskConical size={16} aria-hidden="true" /> Local</div>
          {hasSession && (
            <button type="button" className="local-auth-close" aria-label="Cerrar selector" onClick={() => setIsOpen(false)}>
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        <h1 id="local-auth-title">Sesion de pruebas</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="local-auth-role">Rol</label>
          <select
            id="local-auth-role"
            value={profile.role}
            onChange={(event) => setProfile({ ...profile, role: event.target.value })}
            autoFocus
          >
            {LOCAL_AUTH_ROLES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label htmlFor="local-auth-email">Correo electronico</label>
          <input
            id="local-auth-email"
            type="email"
            autoComplete="off"
            required
            value={profile.email}
            onChange={(event) => setProfile({ ...profile, email: event.target.value })}
          />
          {error && <p className="local-auth-error" role="alert">{error}</p>}
          <button className="local-auth-submit" type="submit">
            Entrar <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </dialog>
    </>
  );
};

export default function LocalAuthGate(props) {
  return isLocalAuthBypassEnabled() ? <LocalAuthSelector {...props} /> : props.children;
}
