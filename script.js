"use strict";

// Class descriptions are structured data, not HTML from visitors.
const yogaClasses = [
  { id: "gentle", name: "Gentle Yoga", level: "Beginner-friendly", description: "Slow-paced movement with seated or supported options. A welcoming place to begin." },
  { id: "vinyasa", name: "Vinyasa Yoga", level: "Move at your pace", description: "A flowing practice that connects movement and breath, with opportunities to rest." },
  { id: "restorative", name: "Restorative Yoga", level: "Rest and reset", description: "Quiet, supported poses designed to help you unwind after a busy day." }
];
const preferenceKey = "riverbendPreferredClass";
const formRules = {
  "full-name": { min: 2, label: "Name" },
  email: { label: "Email" },
  interest: { label: "Class or event interest" },
  experience: { label: "Experience level" },
  message: { min: 10, label: "Message" }
};

function getSavedPreference() {
  try { return localStorage.getItem(preferenceKey) || ""; }
  catch (error) { return ""; } // Site still works when browser storage is disabled.
}
function savePreference(value) {
  try { if (value) localStorage.setItem(preferenceKey, value); else localStorage.removeItem(preferenceKey); }
  catch (error) { /* Storage is optional; interaction still works. */ }
}
function showClass(value) {
  const result = document.getElementById("class-result");
  if (!result) return;
  const choice = yogaClasses.find(item => item.id === value);
  result.replaceChildren();
  if (!choice) { const p = document.createElement("p"); p.textContent = "Choose a class to see a recommendation."; result.append(p); return; }
  const heading = document.createElement("h3"); heading.textContent = choice.name;
  const detail = document.createElement("p"); detail.textContent = `${choice.level}: ${choice.description}`;
  result.append(heading, detail);
}
function initClassFinder() {
  const select = document.getElementById("class-preference");
  if (!select) return;
  const saved = getSavedPreference();
  if (yogaClasses.some(item => item.id === saved)) select.value = saved;
  showClass(select.value);
  select.addEventListener("change", () => { savePreference(select.value); showClass(select.value); });
  document.getElementById("clear-preference").addEventListener("click", () => {
    select.value = ""; savePreference(""); showClass(""); select.focus();
  });
}
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const output = document.getElementById(`${fieldId}-error`);
  if (output) output.textContent = message;
  if (field) {
    if (message) { field.setAttribute("aria-invalid", "true"); field.setAttribute("aria-describedby", `${fieldId}-error`); }
    else { field.removeAttribute("aria-invalid"); field.removeAttribute("aria-describedby"); }
  }
}
function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return true;
  const value = field.value.trim();
  const rule = formRules[fieldId];
  let error = "";
  if (!value) error = `${rule.label} is required.`;
  else if (rule.min && value.length < rule.min) error = `${rule.label} must contain at least ${rule.min} characters.`;
  else if (fieldId === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email address, such as name@example.com.";
  showError(fieldId, error);
  return !error;
}
function validateContactMethod() {
  const selected = document.querySelector('input[name="contact-method"]:checked');
  const output = document.getElementById("contact-method-error");
  const error = selected ? "" : "Choose your preferred contact method.";
  output.textContent = error;
  document.querySelectorAll('input[name="contact-method"]').forEach(input => {
    if (error) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", "contact-method-error"); }
    else { input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
  });
  return !error;
}
function validateForm() {
  // Validate every field (rather than short-circuiting) so all errors appear at once.
  const results = Object.keys(formRules).map(validateField);
  results.push(validateContactMethod());
  return results.every(Boolean);
}
function initInterestForm() {
  const form = document.getElementById("interest-form");
  if (!form) return;
  const saved = getSavedPreference();
  const interest = document.getElementById("interest");
  if (yogaClasses.some(item => item.id === saved) && !interest.value) interest.value = saved;
  Object.keys(formRules).forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validateField(id); });
    field.addEventListener("change", () => validateField(id));
  });
  document.querySelectorAll('input[name="contact-method"]').forEach(input => input.addEventListener("change", validateContactMethod));
  form.addEventListener("submit", event => {
    event.preventDefault(); // This static site has no form submission backend.
    const status = document.getElementById("form-status");
    if (!validateForm()) {
      status.textContent = "Please correct the highlighted fields. Your entries have been kept.";
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    status.textContent = "Your information passes validation. This is a demonstration: no request has been sent to the studio.";
  });
}
document.addEventListener("DOMContentLoaded", () => { initClassFinder(); initInterestForm(); });
