{{/*
Return the fully qualified name of the chart.
*/}}
{{- define "my-react-app.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Return chart name
*/}}
{{- define "my-react-app.name" -}}
{{- .Chart.Name -}}
{{- end -}}
