{{/*
Return the fully qualified app name for react-ui
*/}}
{{- define "react-ui.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Fullname helper for resource naming
*/}}
{{- define "react-ui.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "react-ui.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Standardized labels
*/}}
{{- define "react-ui.labels" -}}
app.kubernetes.io/name: {{ include "react-ui.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: "frontend"
app.kubernetes.io/part-of: "web-suite"
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
app.kubernetes.io/managed-by: "{{ .Release.Service }}"
{{- end -}}
