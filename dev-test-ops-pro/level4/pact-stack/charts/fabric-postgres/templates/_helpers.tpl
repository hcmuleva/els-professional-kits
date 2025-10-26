{{/*
Expan the name of the chart.
*/}}
{{- define "fabric-postgres.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "fabric-postgres.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "fabric-postgres.chart" -}}
{{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end }}


{{- define "fabric-postgres.version" -}}
{{ .Values.image.tag | default .Values.global.appVersion | default .Chart.AppVersion }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "fabric-postgres.selectorLabels" -}}
app.kubernetes.io/name: {{ include "fabric-postgres.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels
*/}}


{{- define "fabric-postgres.labels" -}}
app: {{ include "fabric-postgres.name" .}}
helm.sh/chart: {{ include "fabric-postgres.chart" . }}
{{ include "fabric-postgres.selectorLabels" . }}
{{- if (include "fabric-postgres.version" .) }}
version: {{ include "fabric-postgres.version" . | quote }}
app.kubernetes.io/version: {{ include "fabric-postgres.version" . | quote }}
{{- end }}

{{- if .Values.component }}
app.kubernetes.io/component: {{ .Values.component }}
{{- end }}
{{- if .Values.partOf }}
app.kubernetes.io/part-of: {{ .Values.partOf }}
{{- end }}
{{- if .Values.runtime }}
app.openshift.io/runtime: {{ .Values.runtime }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
{{- define "fabric-postgres.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "fabric-postgres.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "fabric-postgres.host" -}}
{{- $chartName := include "fabric-pact-broker.name" . -}}
{{- $host := default $chartName .Values.ingress.host -}}
{{- $subdomain := .Values.ingress.subdomain | default .Values.global.ingressSubdomain -}}
{{- if .Values.ingress.namespaceInHost -}}
{{- printf "%s-%s.%s" $host .Release.Namespace $subdomain -}}
{{- else -}}
{{- printf "%s.%s" $host $subdomain -}}
{{- end -}}
{{- end -}}


{{- define "fabric-postgres.initialDelaySeconds" -}}
{{- if .Values.initialDelaySeconds -}}
{{ .Values.initialDelaySeconds }}
{{- end -}}
{{- end -}}



{{/*
Secret name helper for postgres
*/}}
{{- define "fabric-postgres.secretName" -}}
{{- if .Values.auth.existingSecret -}}
{{- .Values.auth.existingSecret -}}
{{- else -}}
{{- printf "%s-secret" (include "fabric-postgres.fullname" .) -}}
{{- end -}}
{{- end }}



{{- define "fabric-postgres.tlsSecretName" -}}
{{- $secretName := .Values.ingress.tlsSecretName | default .Values.global.tlsSecretName -}}
{{- if $secretName }}
{{- printf "%s" $secretName -}}
{{- else -}}
{{- printf "" -}}
{{- end -}}
{{- end -}}
