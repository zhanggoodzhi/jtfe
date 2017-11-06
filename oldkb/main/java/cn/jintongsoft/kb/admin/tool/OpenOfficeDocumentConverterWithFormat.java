package cn.jintongsoft.kb.admin.tool;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.artofsolving.jodconverter.DocumentFormat;
import com.artofsolving.jodconverter.DocumentFormatRegistry;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;

public class OpenOfficeDocumentConverterWithFormat extends OpenOfficeDocumentConverter {
	private Logger logger = LoggerFactory.getLogger(OpenOfficeDocumentConverterWithFormat.class);
	
	public OpenOfficeDocumentConverterWithFormat(OpenOfficeConnection connection) {
		super(connection);
	}

	public OpenOfficeDocumentConverterWithFormat(OpenOfficeConnection connection,
			DocumentFormatRegistry formatRegistry) {
		super(connection, formatRegistry);
	}

	public void convertWithName(File inputFile, String inputfilename, File outputFile, String outputfilename) {
		
		if (!inputFile.exists()) {
			throw new IllegalArgumentException("inputFile doesn't exist: " + inputFile);
		}
		DocumentFormat inputFormat = getDocumentFormat(inputfilename);
		DocumentFormat outputFormat = getDocumentFormat(outputfilename);
		if (!inputFormat.isImportable()) {
			throw new IllegalArgumentException("unsupported input format: " + inputFormat.getName());
		}
		if (!inputFormat.isExportableTo(outputFormat)) {
			throw new IllegalArgumentException("unsupported conversion: from " + inputFormat.getName() + " to " + outputFormat.getName());
		}
		convertInternal(inputFile, inputFormat, outputFile, outputFormat);
	}
	
	public void convertWithName(InputStream inputStream, String inputfilename, OutputStream outputStream, String outputfilename) {
		DocumentFormat inputFormat = getDocumentFormat(inputfilename);
		DocumentFormat outputFormat = getDocumentFormat(outputfilename);
		if (!inputFormat.isImportable()) {
			throw new IllegalArgumentException("unsupported input format: " + inputFormat.getName());
		}
		if (!inputFormat.isExportableTo(outputFormat)) {
			throw new IllegalArgumentException("unsupported conversion: from " + inputFormat.getName() + " to " + outputFormat.getName());
		}
		convertInternal(inputStream, inputFormat, outputStream, outputFormat);
	}
	
	
	private DocumentFormat getDocumentFormat(String filename) {
		String extension = FilenameUtils.getExtension(filename);
		logger.debug("extension=[{}]", extension);
		DocumentFormat format = getDocumentFormatRegistry().getFormatByFileExtension(extension);
		logger.debug("format=[{}]", format);
		
		if (format == null) {
			throw new IllegalArgumentException("unknown document format for file: " + filename);
		}
		return format;
	}
}
