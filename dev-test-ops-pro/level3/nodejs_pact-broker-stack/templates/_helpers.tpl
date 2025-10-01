{{- define "pact-broker-stack.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "pact-broker-stack.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "pact-broker-stack.labels" -}}
app.kubernetes.io/name: {{ include "pact-broker-stack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "pact-broker-stack.postgres.fullname" -}}
{{ include "pact-broker-stack.fullname" . }}-postgres
{{- end -}}

{{- define "pact-broker-stack.broker.fullname" -}}
{{ include "pact-broker-stack.fullname" . }}-broker
{{- end -}}
