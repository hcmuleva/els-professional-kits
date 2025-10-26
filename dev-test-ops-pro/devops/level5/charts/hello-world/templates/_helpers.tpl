{{/*
Return the fully qualified app name for hello-world
*/}}
{{- define "hello-world.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Fullname helper for hello-world
*/}}
{{- define "hello-world.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "hello-world.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Standardized labels
*/}}
{{- define "hello-world.labels" -}}
app.kubernetes.io/name: {{ include "hello-world.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: "demo"
app.kubernetes.io/part-of: "web-suite"
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
app.kubernetes.io/managed-by: "{{ .Release.Service }}"
{{- end -}}
