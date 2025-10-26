{{/*
Return the fully qualified app name for temple-api
*/}}
{{- define "temple-api.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Fullname helper for temple-api
*/}}
{{- define "temple-api.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "temple-api.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Standardized labels
*/}}
{{- define "temple-api.labels" -}}
app.kubernetes.io/name: {{ include "temple-api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: "backend"
app.kubernetes.io/part-of: "web-suite"
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
app.kubernetes.io/managed-by: "{{ .Release.Service }}"
{{- end -}}
