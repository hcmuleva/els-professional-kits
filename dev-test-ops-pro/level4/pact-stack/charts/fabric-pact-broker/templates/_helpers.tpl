{{/*
Expan the name of the chart.
*/}}
{{- define "fabric-pact-broker.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "fabric-pact-broker.fullname" -}}
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
{{- define "fabric-pact-broker.chart" -}}
{{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end }}


{{- define "fabric-pact-broker.version" -}}
{{ .Values.image.tag | default .Values.global.appVersion | default .Chart.AppVersion }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "fabric-pact-broker.selectorLabels" -}}
app.kubernetes.io/name: {{ include "fabric-pact-broker.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "fabric-pact-broker.istio" -}}
{{- if .Values.istio -}}
true
{{- else -}}
false
{{- end }}
{{- end }}
{{- define "fabric-pact-broker.labels" -}}
app: {{ include "fabric-pact-broker.name" .}}
helm.sh/chart: {{ include "fabric-pact-broker.chart" . }}
{{ include "fabric-pact-broker.selectorLabels" . }}
{{- if (include "fabric-pact-broker.version" .) }}
version: {{ include "fabric-pact-broker.version" . | quote }}
app.kubernetes.io/version: {{ include "fabric-pact-broker.version" . | quote }}
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
{{- define "fabric-pact-broker.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "fabric-pact-broker.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "fabric-pact-broker.host" -}}
{{- $chartName := include "fabric-pact-broker.name" . -}}
{{- $host := default $chartName .Values.ingress.host -}}
{{- $subdomain := .Values.ingress.subdomain | default .Values.global.ingressSubdomain -}}
{{- if .Values.ingress.namespaceInHost -}}
{{- printf "%s-%s.%s" $host .Release.Namespace $subdomain -}}
{{- else -}}
{{- printf "%s.%s" $host $subdomain -}}
{{- end -}}
{{- end -}}


{{- define "fabric-pact-broker.initialDelaySeconds" -}}
{{- if .Values.initialDelaySeconds -}}
{{ .Values.initialDelaySeconds }}
{{- end -}}
{{- end -}}



{{/*
Secret name helper for database credentials
*/}}
{{- define "fabric-pact-broker.secretName" -}}
{{- if .Values.database.existingSecret -}}
{{- .Values.database.existingSecret -}}
{{- else -}}
{{- printf "%s-db-auth" .Release.Name -}}
{{- end -}}
{{- end }}



{{- define "fabric-pact-broker.tlsSecretName" -}}
{{- $secretName := .Values.ingress.tlsSecretName | default .Values.global.tlsSecretName -}}
{{- if $secretName }}
{{- printf "%s" $secretName -}}
{{- else -}}
{{- printf "" -}}
{{- end -}}
{{- end -}}